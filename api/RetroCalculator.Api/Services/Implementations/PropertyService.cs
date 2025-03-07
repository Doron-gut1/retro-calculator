using System.Data;
using System.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class PropertyService : IPropertyService
{
    private readonly ILogger<PropertyService> _logger;
    private string? _connectionString;
    private readonly OdbcConverter.OdbcConverter _odbcConverter;

    public PropertyService(ILogger<PropertyService> logger)
    {
        _logger = logger;
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

    public async Task<bool> IsPropertyLockedAsync(string id)
    {
        if (_connectionString == null)
        {
            throw new InvalidOperationException("Connection string not set. Call method with ODBC first.");
        }

        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // בדיקה אם הנכס נעול
        var command = new SqlCommand(
            @"SELECT 1 
              FROM Temparnmforat 
              WHERE hs = @hskod 
              AND moneln <> 0", connection);

        command.Parameters.AddWithValue("@hskod", id);
        var result = await command.ExecuteScalarAsync();
        return result != null;
    }

    public async Task<PropertyDto> GetPropertyAsync(string id, string odbcName)
    {
        SetConnectionString(odbcName);
        
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        var propertyCommand = new SqlCommand("GetPropertyDetails", connection);
        propertyCommand.CommandType = CommandType.StoredProcedure;
        propertyCommand.Parameters.AddWithValue("@hskod", id);

        using var reader = await propertyCommand.ExecuteReaderAsync();
        
        if (!await reader.ReadAsync())
        {
            throw new KeyNotFoundException($"Property {id} not found");
        }

        var property = new PropertyDto
        {
            PropertyId = reader["hskod"].ToString() ?? string.Empty,
            PayerId = reader.IsDBNull(reader.GetOrdinal("mspkod")) ? 0 : (int)reader["mspkod"],
            PayerNumber = reader.IsDBNull(reader.GetOrdinal("maintz")) ? 0 : Convert.ToDecimal(reader["maintz"]),
            PayerName = reader.IsDBNull(reader.GetOrdinal("fullname")) ? string.Empty : reader["fullname"].ToString() ?? string.Empty,
            
            // גדלים
            Size1 = reader.IsDBNull(reader.GetOrdinal("godel")) ? 0 : Convert.ToDecimal(reader["godel"]),
            Size2 = reader.IsDBNull(reader.GetOrdinal("gdl2")) ? 0 : Convert.ToDecimal(reader["gdl2"]),
            Size3 = reader.IsDBNull(reader.GetOrdinal("gdl3")) ? 0 : Convert.ToDecimal(reader["gdl3"]),
            Size4 = reader.IsDBNull(reader.GetOrdinal("gdl4")) ? 0 : Convert.ToDecimal(reader["gdl4"]),
            Size5 = reader.IsDBNull(reader.GetOrdinal("gdl5")) ? 0 : Convert.ToDecimal(reader["gdl5"]),
            Size6 = reader.IsDBNull(reader.GetOrdinal("gdl6")) ? 0 : Convert.ToDecimal(reader["gdl6"]),
            Size7 = reader.IsDBNull(reader.GetOrdinal("gdl7")) ? 0 : Convert.ToDecimal(reader["gdl7"]),
            Size8 = reader.IsDBNull(reader.GetOrdinal("gdl8")) ? 0 : Convert.ToDecimal(reader["gdl8"]),
            
            // תעריפים
            Tariff1 = reader.IsDBNull(reader.GetOrdinal("mas")) ? 0 : (int)reader["mas"],
            Tariff2 = reader.IsDBNull(reader.GetOrdinal("mas2")) ? 0 : (int)reader["mas2"],
            Tariff3 = reader.IsDBNull(reader.GetOrdinal("mas3")) ? 0 : (int)reader["mas3"],
            Tariff4 = reader.IsDBNull(reader.GetOrdinal("mas4")) ? 0 : (int)reader["mas4"],
            Tariff5 = reader.IsDBNull(reader.GetOrdinal("mas5")) ? 0 : (int)reader["mas5"],
            Tariff6 = reader.IsDBNull(reader.GetOrdinal("mas6")) ? 0 : (int)reader["mas6"],
            Tariff7 = reader.IsDBNull(reader.GetOrdinal("mas7")) ? 0 : (int)reader["mas7"],
            Tariff8 = reader.IsDBNull(reader.GetOrdinal("mas8")) ? 0 : (int)reader["mas8"],

            // תעריפים - שמות
            Tariff1Name = reader.IsDBNull(reader.GetOrdinal("mas1_name")) ? string.Empty : reader["mas1_name"].ToString(),
            Tariff2Name = reader.IsDBNull(reader.GetOrdinal("mas2_name")) ? string.Empty : reader["mas2_name"].ToString(),
            Tariff3Name = reader.IsDBNull(reader.GetOrdinal("mas3_name")) ? string.Empty : reader["mas3_name"].ToString(),
            Tariff4Name = reader.IsDBNull(reader.GetOrdinal("mas4_name")) ? string.Empty : reader["mas4_name"].ToString(),
            Tariff5Name = reader.IsDBNull(reader.GetOrdinal("mas5_name")) ? string.Empty : reader["mas5_name"].ToString(),
            Tariff6Name = reader.IsDBNull(reader.GetOrdinal("mas6_name")) ? string.Empty : reader["mas6_name"].ToString(),
            Tariff7Name = reader.IsDBNull(reader.GetOrdinal("mas7_name")) ? string.Empty : reader["mas7_name"].ToString(),
            Tariff8Name = reader.IsDBNull(reader.GetOrdinal("mas8_name")) ? string.Empty : reader["mas8_name"].ToString(),

            // תאריכי תוקף
            ValidFrom = reader.IsDBNull(reader.GetOrdinal("valdate")) ? null : reader.GetDateTime(reader.GetOrdinal("valdate")),
            ValidTo = reader.IsDBNull(reader.GetOrdinal("valdatesof")) ? null : reader.GetDateTime(reader.GetOrdinal("valdatesof"))
        };

        return property;
    }

    public async Task<bool> ValidatePropertyAsync(string id, string odbcName)
    {
        SetConnectionString(odbcName);

        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqlCommand(
            "SELECT 1 FROM hs WHERE hskod = @hskod", 
            connection);

        command.Parameters.AddWithValue("@hskod", id);

        var result = await command.ExecuteScalarAsync();
        return result != null;
    }

  
    public async Task<List<TariffDto>> GetTariffsAsync(string odbcName)
    {
        SetConnectionString(odbcName);
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        var command = new SqlCommand("SELECT distinct kodln, teur FROM mas", connection);

        using var reader = await command.ExecuteReaderAsync();

        var tariffs = new List<TariffDto>();
        while (await reader.ReadAsync())
        {
            tariffs.Add(new TariffDto
            {
                Kodln = reader.IsDBNull(reader.GetOrdinal("kodln")) ? 0 : (int)reader["kodln"] ,// reader.GetString(reader.GetOrdinal("kodln")),
                Teur = reader.GetString(reader.GetOrdinal("teur"))
            });
        }

        if (tariffs.Count == 0)
        {
            throw new KeyNotFoundException("No tariffs found");
        }

        return tariffs;
    }

    public async Task<List<PayerDto>> GetPayersAsync(string odbcName)
    {
        SetConnectionString(odbcName);
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        var command = new SqlCommand("SELECT DISTINCT  top 100 msp.maintz, msp.fullname, msp.mspkod FROM msp WHERE msp.archion=0 ORDER BY msp.maintz", connection);

        using var reader = await command.ExecuteReaderAsync(); 

        var payers = new List<PayerDto>();
        //await connection.OpenAsync();

        //using var command = new SqlCommand(query, connection);
        //using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            payers.Add(new PayerDto
            {
                MspKod = reader.GetInt32(reader.GetOrdinal("mspkod")),
                Maintz = reader.GetDouble(reader.GetOrdinal("maintz")),
                FullName = reader.GetString(reader.GetOrdinal("fullname"))
            });
        }

        return payers;
    }
}