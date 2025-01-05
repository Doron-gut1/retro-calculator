using System.Data;
using System.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService
{
    private readonly ILogger<RetroService> _logger;
    private readonly ICalcProcessManager _calcProcessManager;
    private string? _connectionString;
    private readonly dynamic? _odbcConverter;

    public RetroService(
        ILogger<RetroService> logger,
        ICalcProcessManager calcProcessManager)
    {
        _logger = logger;
        _calcProcessManager = calcProcessManager;
        
        try
        {
            var type = Type.GetType("OdbcConverter.OdbcConverter, OdbcConverter");
            if (type == null)
            {
                throw new InvalidOperationException("Could not load OdbcConverter type");
            }
            _odbcConverter = Activator.CreateInstance(type);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing OdbcConverter");
            throw;
        }
    }

    private async Task<SqlConnection> GetConnectionAsync(string odbcName)
    {
        if (string.IsNullOrEmpty(_connectionString))
        {
            try 
            {
                if (_odbcConverter == null)
                {
                    throw new InvalidOperationException("OdbcConverter not initialized");
                }

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

    public async Task<DataTable> CalculateRetroAsync(
        RetroCalculationRequestDto request,
        string odbcName)
    {
        _logger.LogInformation(
            "Starting retro calculation for property {PropertyId}",
            request.PropertyId);

        using var connection = await GetConnectionAsync(odbcName);

        // Check if property is locked
        var lockCheckCommand = new SqlCommand(
            "SELECT 1 FROM Temparnmforat WHERE hs = @hskod AND moneln <> 0", connection);
        lockCheckCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
        var isLocked = await lockCheckCommand.ExecuteScalarAsync() != null;

        if (isLocked)
        {
            throw new InvalidOperationException("Property is locked by another process");
        }

        await CleanupTempData(connection, request.PropertyId, request.JobNumber);

        // Insert initial calculation request
        await connection.ExecuteCommandAsync($"""
            EXEC [dbo].[PrepareRetroData] '{request.PropertyId}', 0;
            EXEC [dbo].[MultiplyTempArnmforatRows] '{request.PropertyId}', '{string.Join(", ", request.ChargeTypes)}', 0;
        """);

        // Run calculation
        _logger.LogInformation("Starting DLL calculation");
        var success = await _calcProcessManager.CalculateRetroAsync(
            odbcName,
            "RetroWeb",  // Username
            request.JobNumber,
            1,            // ProcessType
            request.PropertyId);

        if (!success)
        {
            throw new InvalidOperationException("DLL calculation failed");
        }

        return await GetRetroResultsAsync(request.PropertyId, request.JobNumber, odbcName);
    }

    public async Task<DataTable> GetRetroResultsAsync(
        string propertyId,
        int jobNum,
        string odbcName)
    {
        using var connection = await GetConnectionAsync(odbcName);
        var query = @"
            SELECT 
                hs AS PropertyId,
                dbo.mntname(mnt) AS Period,
                sugts AS ChargeTypeId,
                paysum AS PaymentAmount,
                sumhan AS DiscountAmount,
                paysum - sumhan AS Total,
                dtgv AS CollectionDate,
                dtval AS ValueDate
            FROM Temparnmforat
            WHERE hs = @propertyId
            AND jobnum = @jobNum
            AND (ISNULL(paysum, 0) <> 0 OR ISNULL(sumhan, 0) <> 0)
            ORDER BY mnt, hdtme, IsNewCalculation, hnckod";

        var adapter = new SqlDataAdapter(
            new SqlCommand(query, connection)
            {
                Parameters =
                {
                    new SqlParameter("@propertyId", propertyId),
                    new SqlParameter("@jobNum", jobNum)
                }
            });

        var results = new DataTable();
        adapter.Fill(results);
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