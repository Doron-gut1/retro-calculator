using Microsoft.Data.SqlClient;
using RetroCalculator.Api.Models;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService
{
    private readonly ILogger<RetroService> _logger;
    private readonly ICalcProcessManager _calcProcessManager;
    private string? _connectionString;
    private readonly OdbcConverter.OdbcConverter _odbcConverter;

    public RetroService(
        ILogger<RetroService> logger,
        ICalcProcessManager calcProcessManager)
    {
        _logger = logger;
        _calcProcessManager = calcProcessManager;
        _odbcConverter = new OdbcConverter.OdbcConverter();
    }

    private void SetConnectionString(string odbcName)
    {
        _connectionString = _odbcConverter.GetSqlConnectionString(odbcName, "", "");
        
        if (string.IsNullOrEmpty(_connectionString))
        {
            throw new InvalidOperationException($"Failed to get connection string for ODBC: {odbcName}");
        }

        _logger.LogInformation($"Connection string set successfully for ODBC: {odbcName}");
    }

    public async Task<IEnumerable<TempArnmforat>> CalculateRetroAsync(
        RetroCalculationRequest request,
        string odbcName)
    {
        _logger.LogInformation(
            "Starting retro calculation for property {PropertyId} from {StartDate} to {EndDate}",
            request.PropertyId, request.StartDate, request.EndDate);

        SetConnectionString(odbcName);
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // בדיקת נעילה
        var lockCheckCommand = new SqlCommand(
            @"SELECT 1 
              FROM Temparnmforat 
              WHERE hs = @hskod 
              AND moneln <> 0", connection);

        lockCheckCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
        var isLocked = await lockCheckCommand.ExecuteScalarAsync() != null;

        if (isLocked)
        {
            _logger.LogWarning("Property {PropertyId} is locked", request.PropertyId);
            throw new InvalidOperationException("Property is locked by another process");
        }

        var jobNum = new Random().Next(1000000, 9999999);
        _logger.LogInformation("Generated job number: {JobNum}", jobNum);

        try
        {
            // מחיקת נתונים ישנים
            var cleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE jobnum = @jobnum OR (hs = @hs AND jobnum = 0)",
                connection);
            cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
            cleanupCommand.Parameters.AddWithValue("@hs", request.PropertyId);
            await cleanupCommand.ExecuteNonQueryAsync();
            _logger.LogInformation("Cleaned up old data");

            // הכנסת שורה בסיסית לכל סוג חיוב
            foreach (var sugts in request.ChargeTypes)
            {
                _logger.LogInformation("Processing charge type: {ChargeType}", sugts);

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
                insertCommand.Parameters.AddWithValue("@sugts", sugts);
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
                _logger.LogInformation("Inserted base row for charge type {ChargeType}", sugts);
            }

            // הפעלת פרוצדורות הכנה
            _logger.LogInformation("Running preparation procedures");
            
            var preparationCommand = new SqlCommand(
                $"EXEC [dbo].[PrepareRetroData] @hs, 0",
                connection);
            preparationCommand.Parameters.AddWithValue("@hs", request.PropertyId);
            await preparationCommand.ExecuteNonQueryAsync();
            _logger.LogInformation("PrepareRetroData completed");

            var chargeTypesStr = string.Join(", ", request.ChargeTypes);
            var multiplyCommand = new SqlCommand(
                $"EXEC [dbo].[MultiplyTempArnmforatRows] @hs, @chargeTypes, 0",
                connection);
            multiplyCommand.Parameters.AddWithValue("@hs", request.PropertyId);
            multiplyCommand.Parameters.AddWithValue("@chargeTypes", chargeTypesStr);
            await multiplyCommand.ExecuteNonQueryAsync();
            _logger.LogInformation("MultiplyTempArnmforatRows completed");

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
            
            // ניקוי במקרה של שגיאה
            var cleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE jobnum = @jobnum",
                connection);
            cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
            await cleanupCommand.ExecuteNonQueryAsync();
            _logger.LogInformation("Cleaned up after error");
            
            throw;
        }
    }

    public async Task<IEnumerable<TempArnmforat>> GetRetroResultsAsync(
        string propertyId,
        int jobNum,
        string odbcName)
    {
        _logger.LogInformation(
            "Getting retro results for property {PropertyId}, job {JobNum}",
            propertyId, jobNum);

        SetConnectionString(odbcName);
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        var results = new List<TempArnmforat>();
        var command = new SqlCommand(@"
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
            _logger.LogDebug("Found result row for property {PropertyId}", propertyId);
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

        _logger.LogInformation("Found {Count} results", results.Count);
        return results;
    }
}