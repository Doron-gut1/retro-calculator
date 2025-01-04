using System.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services;

public class RetroService : IRetroService
{
    private readonly ICalculationService _calculationService;
    private readonly ILogger<RetroService> _logger;
    private readonly string _connectionString;

    public RetroService(
        ICalculationService calculationService,
        ILogger<RetroService> logger,
        IConfiguration configuration)
    {
        _calculationService = calculationService;
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<RetroCalculationResultDto>> CalculateRetroAsync(RetroCalculationRequestDto calculation)
    {
        try
        {
            // 1. Initialize calculation in Temparnmforat
            await _calculationService.InitializeCalculationAsync(calculation.PropertyId, calculation.JobNumber);

            // 2. Run SQL procedures to create period rows
            // TODO: Call appropriate SQL procedures

            // 3. Run DLL calculation
            var success = await _calculationService.RunRetroCalculationAsync(calculation.JobNumber, _connectionString);
            if (!success)
            {
                throw new Exception("DLL calculation failed");
            }

            // 4. Fetch and return results
            // TODO: Query Temparnmforat for results
            throw new NotImplementedException();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro for property {PropertyId}", calculation.PropertyId);
            throw;
        }
    }

    public async Task<bool> ApproveRetroAsync(string propertyId, List<RetroCalculationResultDto> results)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        using var transaction = await connection.BeginTransactionAsync();

        try
        {
            // 1. InsertFromTemparnmforatToArnmforat
            using (var command = new SqlCommand("[dbo].[InsertFromTemparnmforatToArnmforat]", connection, transaction))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@hskod", propertyId);
                await command.ExecuteNonQueryAsync();
            }

            // 2. InsertFromTemparnmforatToTash
            using (var command = new SqlCommand("[dbo].[InsertFromTemparnmforatToTash]", connection, transaction))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@hskod", propertyId);
                command.Parameters.AddWithValue("@history", false); // TODO: Get from frontend
                command.Parameters.AddWithValue("@hefreshim", false); // TODO: Get from frontend
                command.Parameters.AddWithValue("@siman", 0);
                command.Parameters.AddWithValue("@thisuser", "system"); // TODO: Get from authentication
                command.Parameters.AddWithValue("@remx", 0);
                await command.ExecuteNonQueryAsync();
            }

            // 3. UpdateArnFromTemparnmforat
            using (var command = new SqlCommand("[dbo].[UpdateArnFromTemparnmforat]", connection, transaction))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@hskod", propertyId);
                command.Parameters.AddWithValue("@dtstart", DateTime.Today); // TODO: Get from calculation
                command.Parameters.AddWithValue("@dtend", DateTime.Today); // TODO: Get from calculation
                await command.ExecuteNonQueryAsync();
            }

            // 4. UpdateHsFromRetro (optional)
            // TODO: Add condition for when to run this
            using (var command = new SqlCommand("[dbo].[UpdateHsFromRetro]", connection, transaction))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@jobnum", 0); // TODO: Get from calculation
                command.Parameters.AddWithValue("@dtstart", DateTime.Today); // TODO: Get from calculation
                await command.ExecuteNonQueryAsync();
            }

            // 5. Clean up Temparnmforat
            using (var command = new SqlCommand("DELETE FROM Temparnmforat WHERE jobnum = @jobnum", connection, transaction))
            {
                command.Parameters.AddWithValue("@jobnum", 0); // TODO: Get from calculation
                await command.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving retro for property {PropertyId}", propertyId);
            await transaction.RollbackAsync();
            return false;
        }
    }
}