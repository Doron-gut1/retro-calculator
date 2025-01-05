using Microsoft.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService
{
    private readonly ILogger<RetroService> _logger;
    private string? _connectionString;
    private readonly OdbcConverter.OdbcConverter _odbcConverter;

    public RetroService(ILogger<RetroService> logger)
    {
        _logger = logger;
        _odbcConverter = new OdbcConverter.OdbcConverter();
    }

    public async Task<List<RetroCalculationResultDto>> CalculateRetroAsync(RetroCalculationRequestDto calculation)
    {
        var results = new List<RetroCalculationResultDto>();

        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqlCommand(
            @"SELECT 
                dbo.mntname(mnt) as Period,
                sugts as ChargeTypeId,
                paysum as PaymentAmount,
                sumhan as DiscountAmount,
                dtgv as CollectionDate,
                dtval as ValueDate
              FROM Temparnmforat 
              WHERE hs = @hskod
              AND jobnum = @jobnum", 
            connection);

        command.Parameters.AddWithValue("@hskod", calculation.PropertyId);
        command.Parameters.AddWithValue("@jobnum", calculation.JobNumber);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var result = new RetroCalculationResultDto
            {
                PropertyId = calculation.PropertyId,
                Period = reader["Period"].ToString() ?? string.Empty,  // כבר מגיע כסטרינג מSQL
                ChargeTypeId = reader.GetInt32(reader.GetOrdinal("ChargeTypeId")),
                PaymentAmount = reader.GetDecimal(reader.GetOrdinal("PaymentAmount")),
                DiscountAmount = reader.GetDecimal(reader.GetOrdinal("DiscountAmount")),
                Total = reader.GetDecimal(reader.GetOrdinal("PaymentAmount")) - reader.GetDecimal(reader.GetOrdinal("DiscountAmount")),
                CollectionDate = reader.IsDBNull(reader.GetOrdinal("CollectionDate")) ? null : reader.GetDateTime(reader.GetOrdinal("CollectionDate")),
                ValueDate = reader.IsDBNull(reader.GetOrdinal("ValueDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ValueDate"))
            };
            results.Add(result);
        }

        return results;
    }
}