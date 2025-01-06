using System.Data.SqlClient;
using RetroCalculator.Api.Models;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService
{
    private readonly ILogger<RetroService> _logger;
    private readonly ICalcProcessManager _calcProcessManager;
    private string? _connectionString;
    private readonly dynamic _odbcConverter;

    public RetroService(
        ILogger<RetroService> logger,
        ICalcProcessManager calcProcessManager)
    {
        _logger = logger;
        _calcProcessManager = calcProcessManager;
        
        var type = Type.GetType("OdbcConverter.OdbcConverter, OdbcConverter");
        if (type == null)
        {
            throw new InvalidOperationException("Could not load OdbcConverter type");
        }
        _odbcConverter = Activator.CreateInstance(type);
    }

    private async Task<SqlConnection> GetConnectionAsync(string odbcName)
    {
        if (string.IsNullOrEmpty(_connectionString))
        {
            try 
            {
                _connectionString = _odbcConverter.GetSqlConnectionString(odbcName, "", "");
                if (string.IsNullOrEmpty(_connectionString))
                {
                    throw new InvalidOperationException($"Failed to get connection string for ODBC: {odbcName}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting connection string for ODBC: {OdbcName}", odbcName);
                throw;
            }
        }

        var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        return connection;
    }

    private async Task CleanupTempData(SqlConnection connection, string propertyId, int jobNum)
    {
        var cleanupCommand = new SqlCommand(
            "DELETE FROM Temparnmforat WHERE jobnum = @jobnum OR (hs = @hs AND jobnum = 0)",
            connection);
        cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
        cleanupCommand.Parameters.AddWithValue("@hs", propertyId);
        await cleanupCommand.ExecuteNonQueryAsync();
    }

    public async Task<IEnumerable<TempArnmforat>> CalculateRetroAsync(
        RetroCalculationRequest request,
        string odbcName)
    {
        _logger.LogInformation(
            "Starting retro calculation for property {PropertyId} from {StartDate} to {EndDate}",
            request.PropertyId, request.StartDate, request.EndDate);

        using var connection = await GetConnectionAsync(odbcName);
        var jobNum = new Random().Next(1000000, 9999999);

        try
        {
            // Check if property is locked
            var lockCheckCommand = new SqlCommand(
                "SELECT 1 FROM Temparnmforat WHERE hs = @hskod AND moneln <> 0", connection);
            lockCheckCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
            var isLocked = await lockCheckCommand.ExecuteScalarAsync() != null;

            if (isLocked)
            {
                throw new InvalidOperationException("Property is locked by another process");
            }

            await CleanupTempData(connection, request.PropertyId, jobNum);

            // Insert initial data
            var insertCommand = new SqlCommand(@"
                INSERT INTO Temparnmforat (
                    hs, mspkod, sugts, 
                    gdl1, trf1, gdl2, trf2, gdl3, trf3, gdl4, trf4,
                    gdl5, trf5, gdl6, trf6, gdl7, trf7, gdl8, trf8,
                    hdtme, hdtad, jobnum, valdate, valdatesof
                ) VALUES (
                    @hs, @mspkod, @sugts,
                    @gdl1, @trf1, @gdl2, @trf2, @gdl3, @trf3, @gdl4, @trf4,
                    @gdl5, @trf5, @gdl6, @trf6, @gdl7, @trf7, @gdl8, @trf8,
                    @hdtme, @hdtad, @jobnum, @valdate, @valdatesof
                )", connection);

            insertCommand.Parameters.AddWithValue("@hs", request.PropertyId);
            insertCommand.Parameters.AddWithValue("@mspkod", 0);
            insertCommand.Parameters.AddWithValue("@sugts", 1010);
            insertCommand.Parameters.AddWithValue("@hdtme", request.StartDate);
            insertCommand.Parameters.AddWithValue("@hdtad", request.EndDate);
            insertCommand.Parameters.AddWithValue("@jobnum", jobNum);
            insertCommand.Parameters.AddWithValue("@valdate", DBNull.Value);
            insertCommand.Parameters.AddWithValue("@valdatesof", DBNull.Value);

            for (var i = 1; i <= 8; i++)
            {
                var size = request.SizesAndTariffs.FirstOrDefault(s => s.Index == i);
                insertCommand.Parameters.AddWithValue($"@gdl{i}", size?.Size ?? 0);
                insertCommand.Parameters.AddWithValue($"@trf{i}", size?.TariffCode ?? 0);
            }

            await insertCommand.ExecuteNonQueryAsync();

            // Execute preparation procedures
            await connection.ExecuteCommandAsync(
                $"EXEC [dbo].[PrepareRetroData] '{request.PropertyId}', 0");

            var chargeTypesStr = string.Join(", ", request.ChargeTypes);
            await connection.ExecuteCommandAsync(
                $"EXEC [dbo].[MultiplyTempArnmforatRows] '{request.PropertyId}', '{chargeTypesStr}', 0");

            
            // הפעלת החישוב
            _logger.LogInformation("Starting DLL calculation");
            var success = await _calcProcessManager.CalculateRetroAsync(
                odbcName,
                "RetroWeb",
                jobNum,
                1,
                request.PropertyId);

            if (!success)
            {
                _logger.LogError("DLL calculation failed");
                throw new InvalidOperationException("DLL calculation failed");
            }

            _logger.LogInformation("DLL calculation completed successfully");
            return await GetRetroResultsAsync(request.PropertyId, jobNum, odbcName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during retro calculation");

            var cleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE jobnum = @jobnum",
                connection);
            cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
            await cleanupCommand.ExecuteNonQueryAsync();

            throw;
        }
    }

    public async Task<IEnumerable<TempArnmforat>> GetRetroResultsAsync(
        string propertyId,
        int jobNum,
        string odbcName)
    {
        using var connection = await GetConnectionAsync(odbcName);
        var results = new List<TempArnmforat>();

        using var command = new SqlCommand(@"
            SELECT *
            FROM Temparnmforat
            WHERE hs = @propertyId
            AND jobnum = @jobNum
            AND (ISNULL(paysum, 0) <> 0 OR ISNULL(sumhan, 0) <> 0)
            ORDER BY mnt, hdtme, IsNewCalculation, hnckod", connection);

        command.Parameters.AddWithValue("@propertyId", propertyId);
        command.Parameters.AddWithValue("@jobNum", jobNum);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(new TempArnmforat
            {
                Hs = reader["hs"].ToString() ?? string.Empty,
                Mspkod = Convert.ToInt32(reader["mspkod"]),
                Sugts = Convert.ToInt32(reader["sugts"]),
                Gdl1 = Convert.ToDouble(reader["gdl1"]),
                Trf1 = Convert.ToInt32(reader["trf1"]),
                Gdl2 = Convert.ToDouble(reader["gdl2"]),
                Trf2 = Convert.ToInt32(reader["trf2"]),
                Gdl3 = Convert.ToDouble(reader["gdl3"]),
                Trf3 = Convert.ToInt32(reader["trf3"]),
                Gdl4 = Convert.ToDouble(reader["gdl4"]),
                Trf4 = Convert.ToInt32(reader["trf4"]),
                Gdl5 = Convert.ToDouble(reader["gdl5"]),
                Trf5 = Convert.ToInt32(reader["trf5"]),
                Gdl6 = Convert.ToDouble(reader["gdl6"]),
                Trf6 = Convert.ToInt32(reader["trf6"]),
                Gdl7 = Convert.ToDouble(reader["gdl7"]),
                Trf7 = Convert.ToInt32(reader["trf7"]),
                Gdl8 = Convert.ToDouble(reader["gdl8"]),
                Trf8 = Convert.ToInt32(reader["trf8"]),
                Hdtme = reader.GetDateTime(reader.GetOrdinal("hdtme")),
                Hdtad = reader.GetDateTime(reader.GetOrdinal("hdtad")),
                Jobnum = Convert.ToInt32(reader["jobnum"]),
                Valdate = reader.IsDBNull(reader.GetOrdinal("valdate")) ? null : reader.GetDateTime(reader.GetOrdinal("valdate")),
                Valdatesof = reader.IsDBNull(reader.GetOrdinal("valdatesof")) ? null : reader.GetDateTime(reader.GetOrdinal("valdatesof")),
                Hkarn = reader.IsDBNull(reader.GetOrdinal("hkarn")) ? 0 : Convert.ToInt32(reader["hkarn"]),
                Dtgv = reader.IsDBNull(reader.GetOrdinal("dtgv")) ? null : reader.GetDateTime(reader.GetOrdinal("dtgv")),
                Dtval = reader.IsDBNull(reader.GetOrdinal("dtval")) ? null : reader.GetDateTime(reader.GetOrdinal("dtval"))
            });
        }

        return results;
    }
}

public static class SqlConnectionExtensions
{
    public static async Task ExecuteCommandAsync(this SqlConnection connection, string commandText)
    {
        using var command = new SqlCommand(commandText, connection);
        await command.ExecuteNonQueryAsync();
    }
}