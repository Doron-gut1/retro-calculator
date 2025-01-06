using System.Data;
using System.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService, IDisposable
{
    private readonly ILogger<RetroService> _logger;
    private readonly ICalcProcessManager _calcProcessManager;
    private string? _connectionString;
    private readonly dynamic _odbcConverter;
    private bool _disposed;

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
        _odbcConverter = Activator.CreateInstance(type) 
            ?? throw new InvalidOperationException("Failed to create OdbcConverter instance");
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
        using var cleanupCommand = new SqlCommand(
            "DELETE FROM Temparnmforat WHERE jobnum = @jobnum OR (hs = @hs AND jobnum = 0)",
            connection);
        cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
        cleanupCommand.Parameters.AddWithValue("@hs", propertyId);
        await cleanupCommand.ExecuteNonQueryAsync();
    }

    public async Task<DataTable> CalculateRetroAsync(
        RetroCalculationRequest request,
        string odbcName)
    {
        _logger.LogInformation(
            "Starting retro calculation for property {PropertyId} from {StartDate} to {EndDate}",
            request.PropertyId, request.StartDate, request.EndDate);

        // Validate request
        if (request.StartDate > request.EndDate)
        {
            throw new ArgumentException("Start date cannot be later than end date");
        }

        using var connection = await GetConnectionAsync(odbcName);

        // Get property and payer details
        using var propertyCommand = new SqlCommand(
            "SELECT h.mspkod FROM hs h WHERE h.hskod = @hskod", 
            connection);
        propertyCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
        var mspkod = await propertyCommand.ExecuteScalarAsync() as int?;

        if (!mspkod.HasValue)
        {
            throw new InvalidOperationException($"Property {request.PropertyId} not found");
        }

        var jobNum = new Random().Next(1000000, 9999999);

        try
        {
            // Check if property is locked
            using var lockCheckCommand = new SqlCommand(
                "SELECT 1 FROM Temparnmforat WHERE hs = @hskod AND moneln <> 0", connection);
            lockCheckCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
            var isLocked = await lockCheckCommand.ExecuteScalarAsync() != null;

            if (isLocked)
            {
                throw new InvalidOperationException("Property is locked by another process");
            }

            await CleanupTempData(connection, request.PropertyId, jobNum);

            // Insert initial data with correct mspkod
            using var insertCommand = new SqlCommand(@"
                INSERT INTO Temparnmforat (
                    hs, mspkod, sugts, 
                    gdl1, trf1, gdl2, trf2, gdl3, trf3, gdl4, trf4,
                    gdl5, trf5, gdl6, trf6, gdl7, trf7, gdl8, trf8,
                    hdtme, hdtad, jobnum, valdate, valdatesof, hkarn
                ) VALUES (
                    @hs, @mspkod, @sugts,
                    @gdl1, @trf1, @gdl2, @trf2, @gdl3, @trf3, @gdl4, @trf4,
                    @gdl5, @trf5, @gdl6, @trf6, @gdl7, @trf7, @gdl8, @trf8,
                    @hdtme, @hdtad, @jobnum, @valdate, @valdatesof, @hkarn
                )", connection);

            insertCommand.Parameters.AddWithValue("@hs", request.PropertyId);
            insertCommand.Parameters.AddWithValue("@mspkod", mspkod.Value);
            insertCommand.Parameters.AddWithValue("@sugts", 1010);
            insertCommand.Parameters.AddWithValue("@hdtme", request.StartDate);
            insertCommand.Parameters.AddWithValue("@hdtad", request.EndDate);
            insertCommand.Parameters.AddWithValue("@jobnum", jobNum);
            insertCommand.Parameters.AddWithValue("@valdate", DBNull.Value);
            insertCommand.Parameters.AddWithValue("@valdatesof", DBNull.Value);
            insertCommand.Parameters.AddWithValue("@hkarn", request.Hkarn);

            for (var i = 1; i <= 8; i++)
            {
                var size = request.SizesAndTariffs.FirstOrDefault(s => s.Index == i);
                insertCommand.Parameters.AddWithValue($"@gdl{i}", size?.Size ?? 0);
                insertCommand.Parameters.AddWithValue($"@trf{i}", size?.TariffCode ?? 0);
            }

            await insertCommand.ExecuteNonQueryAsync();

            // Execute preparation procedures
            using (var command = new SqlCommand($"EXEC [dbo].[PrepareRetroData] '{request.PropertyId}', {mspkod.Value}", connection))
            {
                await command.ExecuteNonQueryAsync();
            }

            var chargeTypesStr = string.Join(", ", request.ChargeTypes);
            using (var command = new SqlCommand($"EXEC [dbo].[MultiplyTempArnmforatRows] '{request.PropertyId}', '{chargeTypesStr}', 0", connection))
            {
                await command.ExecuteNonQueryAsync();
            }

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
            return await GetRetroResultsDataTableAsync(request.PropertyId, jobNum, connection);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during retro calculation");

            using var cleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE jobnum = @jobnum",
                connection);
            cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
            await cleanupCommand.ExecuteNonQueryAsync();

            throw;
        }
    }

    private async Task<DataTable> GetRetroResultsDataTableAsync(
        string propertyId,
        int jobNum,
        SqlConnection connection)
    {
        var dt = new DataTable();
        using var command = new SqlCommand(@"
            SELECT 
                t.*,
                dbo.mntname(t.mnt) as mnt_display,
                s.sugtsname,
                m.fullname as payer_name,
                m.maintz as payer_id
            FROM Temparnmforat t
            LEFT JOIN sugts s ON t.sugts = s.sugts
            LEFT JOIN msp m ON t.mspkod = m.mspkod
            WHERE t.hs = @propertyId
            AND t.jobnum = @jobNum
            AND (ISNULL(t.paysum, 0) <> 0 OR ISNULL(t.sumhan, 0) <> 0)
            ORDER BY t.mnt, t.hdtme, t.IsNewCalculation, t.hnckod", connection);

        command.Parameters.AddWithValue("@propertyId", propertyId);
        command.Parameters.AddWithValue("@jobNum", jobNum);

        using var adapter = new SqlDataAdapter(command);
        await Task.Run(() => adapter.Fill(dt));

        return dt;
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _calcProcessManager.Dispose();
            _disposed = true;
            GC.SuppressFinalize(this);
        }
    }
}