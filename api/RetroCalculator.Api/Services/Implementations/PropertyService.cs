using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;
using System.Data.SqlClient;

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

        // TODO: Implement actual property retrieval logic
        var property = new PropertyDto
        {
            PropertyId = id,
            // ... other properties
        };

        return property;
    }

    public async Task<bool> ValidatePropertyAsync(string id, string odbcName)
    {
        SetConnectionString(odbcName);

        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // TODO: Implement actual validation logic
        return true;
    }
}