using Microsoft.Data.SqlClient;
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

    public async Task<PropertyDto> GetPropertyAsync(string id, string odbcName)
    {
        SetConnectionString(odbcName);
        
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // שליפת פרטי הנכס מHS
        var propertyCommand = new SqlCommand(
            @"SELECT h.hskod, h.mspkod, h.godel, h.mas, h.gdl2, h.mas2, 
                     h.gdl3, h.mas3, h.gdl4, h.mas4, h.gdl5, h.mas5, 
                     h.gdl6, h.mas6, h.gdl7, h.mas7, h.gdl8, h.mas8, 
                     h.valdate, h.valdatesof,
                     m.maintz, m.fullname
              FROM hs h
              LEFT JOIN msp m ON h.mspkod = m.mspkod
              WHERE h.hskod = @hskod", connection);

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
            PayerNumber = reader.IsDBNull(reader.GetOrdinal("maintz")) ? 0 : Convert.ToDouble(reader["maintz"]),
            PayerName = reader.IsDBNull(reader.GetOrdinal("fullname")) ? string.Empty : reader["fullname"].ToString() ?? string.Empty,
            
            // גדלים
            Size1 = reader.IsDBNull(reader.GetOrdinal("godel")) ? 0 : Convert.ToDouble(reader["godel"]),
            Size2 = reader.IsDBNull(reader.GetOrdinal("gdl2")) ? 0 : Convert.ToDouble(reader["gdl2"]),
            Size3 = reader.IsDBNull(reader.GetOrdinal("gdl3")) ? 0 : Convert.ToDouble(reader["gdl3"]),
            Size4 = reader.IsDBNull(reader.GetOrdinal("gdl4")) ? 0 : Convert.ToDouble(reader["gdl4"]),
            Size5 = reader.IsDBNull(reader.GetOrdinal("gdl5")) ? 0 : Convert.ToDouble(reader["gdl5"]),
            Size6 = reader.IsDBNull(reader.GetOrdinal("gdl6")) ? 0 : Convert.ToDouble(reader["gdl6"]),
            Size7 = reader.IsDBNull(reader.GetOrdinal("gdl7")) ? 0 : Convert.ToDouble(reader["gdl7"]),
            Size8 = reader.IsDBNull(reader.GetOrdinal("gdl8")) ? 0 : Convert.ToDouble(reader["gdl8"]),
            
            // תעריפים
            Tariff1 = reader.IsDBNull(reader.GetOrdinal("mas")) ? 0 : (int)reader["mas"],
            Tariff2 = reader.IsDBNull(reader.GetOrdinal("mas2")) ? 0 : (int)reader["mas2"],
            Tariff3 = reader.IsDBNull(reader.GetOrdinal("mas3")) ? 0 : (int)reader["mas3"],
            Tariff4 = reader.IsDBNull(reader.GetOrdinal("mas4")) ? 0 : (int)reader["mas4"],
            Tariff5 = reader.IsDBNull(reader.GetOrdinal("mas5")) ? 0 : (int)reader["mas5"],
            Tariff6 = reader.IsDBNull(reader.GetOrdinal("mas6")) ? 0 : (int)reader["mas6"],
            Tariff7 = reader.IsDBNull(reader.GetOrdinal("mas7")) ? 0 : (int)reader["mas7"],
            Tariff8 = reader.IsDBNull(reader.GetOrdinal("mas8")) ? 0 : (int)reader["mas8"],

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

    public Task<bool>? IsPropertyLockedAsync(string propertyId)
    {
        throw new NotImplementedException();
    }
}