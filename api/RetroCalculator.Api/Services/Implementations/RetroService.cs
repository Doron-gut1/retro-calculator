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

    private async Task InsertInitialData(SqlConnection connection, RetroCalculationRequestDto request, PropertyDto propertyData)
    {
        // Insert initial row with jobnum and sugts 1010
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
        insertCommand.Parameters.AddWithValue("@mspkod", propertyData.PayerId);
        insertCommand.Parameters.AddWithValue("@sugts", 1010); // קוד קבוע לרטרו
        insertCommand.Parameters.AddWithValue("@hdtme", request.StartDate);
        insertCommand.Parameters.AddWithValue("@hdtad", request.EndDate);
        insertCommand.Parameters.AddWithValue("@jobnum", request.JobNumber);
        insertCommand.Parameters.AddWithValue("@valdate", propertyData.ValidFrom ?? (object)DBNull.Value);
        insertCommand.Parameters.AddWithValue("@valdatesof", propertyData.ValidTo ?? (object)DBNull.Value);

        // Add sizes and tariffs
        insertCommand.Parameters.AddWithValue("@gdl1", propertyData.Size1);
        insertCommand.Parameters.AddWithValue("@trf1", propertyData.Tariff1);
        insertCommand.Parameters.AddWithValue("@gdl2", propertyData.Size2);
        insertCommand.Parameters.AddWithValue("@trf2", propertyData.Tariff2);
        insertCommand.Parameters.AddWithValue("@gdl3", propertyData.Size3);
        insertCommand.Parameters.AddWithValue("@trf3", propertyData.Tariff3);
        insertCommand.Parameters.AddWithValue("@gdl4", propertyData.Size4);
        insertCommand.Parameters.AddWithValue("@trf4", propertyData.Tariff4);
        insertCommand.Parameters.AddWithValue("@gdl5", propertyData.Size5);
        insertCommand.Parameters.AddWithValue("@trf5", propertyData.Tariff5);
        insertCommand.Parameters.AddWithValue("@gdl6", propertyData.Size6);
        insertCommand.Parameters.AddWithValue("@trf6", propertyData.Tariff6);
        insertCommand.Parameters.AddWithValue("@gdl7", propertyData.Size7);
        insertCommand.Parameters.AddWithValue("@trf7", propertyData.Tariff7);
        insertCommand.Parameters.AddWithValue("@gdl8", propertyData.Size8);
        insertCommand.Parameters.AddWithValue("@trf8", propertyData.Tariff8);

        await insertCommand.ExecuteNonQueryAsync();
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

        // Get property data
        var propertyCommand = new SqlCommand(@"
            SELECT 
                hs.mspkod, 
                hs.godel, hs.gdl2, hs.gdl3, hs.gdl4, hs.gdl5, hs.gdl6, hs.gdl7, hs.gdl8,
                hs.mas, hs.mas2, hs.mas3, hs.mas4, hs.mas5, hs.mas6, hs.mas7, hs.mas8,
                hs.valdate, hs.valdatesof
            FROM hs 
            WHERE hs.hskod = @propertyId", connection);
        propertyCommand.Parameters.AddWithValue("@propertyId", request.PropertyId);

        using var reader = await propertyCommand.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
        {
            throw new InvalidOperationException($"Property {request.PropertyId} not found");
        }

        var propertyData = new PropertyDto
        {
            PropertyId = request.PropertyId,
            PayerId = reader.GetInt32(reader.GetOrdinal("mspkod")),
            Size1 = reader.GetDouble(reader.GetOrdinal("godel")),
            Tariff1 = reader.GetInt32(reader.GetOrdinal("mas")),
            Size2 = reader.GetDouble(reader.GetOrdinal("gdl2")),
            Tariff2 = reader.GetInt32(reader.GetOrdinal("mas2")),
            Size3 = reader.GetDouble(reader.GetOrdinal("gdl3")),
            Tariff3 = reader.GetInt32(reader.GetOrdinal("mas3")),
            Size4 = reader.GetDouble(reader.GetOrdinal("gdl4")),
            Tariff4 = reader.GetInt32(reader.GetOrdinal("mas4")),
            Size5 = reader.GetDouble(reader.GetOrdinal("gdl5")),
            Tariff5 = reader.GetInt32(reader.GetOrdinal("mas5")),
            Size6 = reader.GetDouble(reader.GetOrdinal("gdl6")),
            Tariff6 = reader.GetInt32(reader.GetOrdinal("mas6")),
            Size7 = reader.GetDouble(reader.GetOrdinal("gdl7")),
            Tariff7 = reader.GetInt32(reader.GetOrdinal("mas7")),
            Size8 = reader.GetDouble(reader.GetOrdinal("gdl8")),
            Tariff8 = reader.GetInt32(reader.GetOrdinal("mas8")),
            ValidFrom = reader.IsDBNull(reader.GetOrdinal("valdate")) ? null : reader.GetDateTime(reader.GetOrdinal("valdate")),
            ValidTo = reader.IsDBNull(reader.GetOrdinal("valdatesof")) ? null : reader.GetDateTime(reader.GetOrdinal("valdatesof"))
        };

        await CleanupTempData(connection, request.PropertyId, request.JobNumber);
        await InsertInitialData(connection, request, propertyData);

        // Run preparation procedures
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