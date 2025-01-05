using Microsoft.Data.SqlClient;
using RetroCalculator.Api.Models;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services;

public class PropertyService : IPropertyService
{
    private readonly ILogger<PropertyService> _logger;
    private readonly string _connectionString;

    public PropertyService(ILogger<PropertyService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string is missing");
    }

    public async Task<PropertyDto?> GetPropertyByIdAsync(string id)
    {
        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand(@"
                SELECT h.hskod, h.mspkod, m.maintz, m.fullname,
                       h.godel, h.mas, h.gdl2, h.mas2, h.valdate, h.valdatesof
                FROM hs h
                JOIN msp m ON h.mspkod = m.mspkod
                WHERE h.hskod = @id", connection);

            command.Parameters.AddWithValue("@id", id);

            using var reader = await command.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                return null;
            }

            return new PropertyDto
            {
                PropertyId = reader.GetString(0),
                Payer = new PayerDto
                {
                    PayerId = reader.GetInt32(1),
                    PayerNumber = reader.GetDouble(2),
                    FullName = reader.GetString(3)
                },
                SizesAndTariffs = new List<SizeAndTariffDto>
                {
                    new() { Index = 1, Size = (float)reader.GetDouble(4), TariffId = reader.GetInt32(5) },
                    new() { Index = 2, Size = (float)reader.GetDouble(6), TariffId = reader.GetInt32(7) }
                },
                ValidFrom = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                ValidTo = reader.IsDBNull(9) ? null : reader.GetDateTime(9)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting property {Id}", id);
            throw;
        }
    }

    public async Task<bool> ValidatePropertyAsync(string id)
    {
        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand(
                "SELECT COUNT(*) FROM hs WHERE hskod = @id", connection);

            command.Parameters.AddWithValue("@id", id);
            var count = (int)await command.ExecuteScalarAsync();

            return count > 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating property {Id}", id);
            return false;
        }
    }

    public async Task<bool> IsPropertyLockedAsync(string propertyId)
    {
        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand(@"
                SELECT COUNT(*) 
                FROM Temparnmforat 
                WHERE hs = @propertyId", connection);

            command.Parameters.AddWithValue("@propertyId", propertyId);
            var count = (int)await command.ExecuteScalarAsync();

            return count > 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if property {PropertyId} is locked", propertyId);
            return false;
        }
    }
}