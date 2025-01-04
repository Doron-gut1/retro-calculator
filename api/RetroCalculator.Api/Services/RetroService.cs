using Microsoft.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services;

public class RetroService : IRetroService
{
    private readonly ICalculationService _calculationService;
    private readonly ILogger<RetroService> _logger;
    private readonly string _connectionString;
    private readonly string _currentUser;

    public RetroService(
        ICalculationService calculationService,
        ILogger<RetroService> logger,
        IConfiguration configuration)
    {
        _calculationService = calculationService;
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string is missing");
        _currentUser = configuration["RetroCalculation:DefaultUser"] ?? "system";
    }

    public async Task<List<RetroCalculationResultDto>> CalculateRetroAsync(RetroCalculationRequestDto calculation)
    {
        try
        {
            // Initialize calculation in Temparnmforat
            await _calculationService.InitializeCalculationAsync(calculation.PropertyId, calculation.JobNumber);

            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            // Check closed periods
            using (var command = new SqlCommand("SELECT dbo.GetMntByDate(@date)", connection))
            {
                command.Parameters.AddWithValue("@date", calculation.StartDate);
                var firstMonth = (int)await command.ExecuteScalarAsync();

                command.Parameters[0].Value = calculation.EndDate;
                var lastMonth = (int)await command.ExecuteScalarAsync();

                using var checkCommand = new SqlCommand(
                    "SELECT COUNT(*) FROM sagur WHERE mnt BETWEEN @firstMonth AND @lastMonth", connection);
                checkCommand.Parameters.AddWithValue("@firstMonth", firstMonth);
                checkCommand.Parameters.AddWithValue("@lastMonth", lastMonth);

                var closedPeriodsCount = (int)await checkCommand.ExecuteScalarAsync();
                if (closedPeriodsCount < (lastMonth - firstMonth + 1))
                {
                    throw new InvalidOperationException("Cannot calculate retro for open periods");
                }
            }

            // Run DLL calculation
            var success = await _calculationService.RunRetroCalculationAsync(calculation.JobNumber, _connectionString);
            if (!success)
            {
                throw new Exception("DLL calculation failed");
            }

            // Fetch results
            var results = new List<RetroCalculationResultDto>();
            using (var command = new SqlCommand(@"
                SELECT mnt, sugts, paysum, sumhan, dtval, dtgv 
                FROM Temparnmforat 
                WHERE hs = @propertyId 
                AND (paysum != 0 OR sumhan != 0)
                ORDER BY mnt", connection))
            {
                command.Parameters.AddWithValue("@propertyId", calculation.PropertyId);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    results.Add(new RetroCalculationResultDto
                    {
                        Period = reader.GetInt32(0),
                        ChargeTypeId = reader.GetInt32(1),
                        PaymentAmount = reader.GetDecimal(2),
                        DiscountAmount = reader.GetDecimal(3),
                        ValueDate = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                        CollectionDate = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                        Total = reader.GetDecimal(2) - reader.GetDecimal(3)
                    });
                }
            }

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro for property {PropertyId}", calculation.PropertyId);
            throw;
        }
    }

    public async Task<bool> ApproveRetroAsync(RetroApprovalDto approval)
    {
        await using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        using var transaction = await connection.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);

        try
        {
            // InsertFromTemparnmforatToArnmforat
            using (var command = new SqlCommand("[dbo].[InsertFromTemparnmforatToArnmforat]", connection))
            {
                command.Transaction = transaction as SqlTransaction;
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@hskod", approval.PropertyId);
                await command.ExecuteNonQueryAsync();
            }

            // InsertFromTemparnmforatToTash
            using (var command = new SqlCommand("[dbo].[InsertFromTemparnmforatToTash]", connection))
            {
                command.Transaction = transaction as SqlTransaction;
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@hskod", approval.PropertyId);
                command.Parameters.AddWithValue("@history", approval.IsHistorical);
                command.Parameters.AddWithValue("@hefreshim", approval.IsDifferencesOnly);
                command.Parameters.AddWithValue("@siman", 0);
                command.Parameters.AddWithValue("@thisuser", _currentUser);
                command.Parameters.AddWithValue("@remx", approval.Notes ?? "");
                await command.ExecuteNonQueryAsync();
            }

            // UpdateArnFromTemparnmforat
            using (var command = new SqlCommand("[dbo].[UpdateArnFromTemparnmforat]", connection))
            {
                command.Transaction = transaction as SqlTransaction;
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@hskod", approval.PropertyId);
                command.Parameters.AddWithValue("@dtstart", approval.StartDate);
                command.Parameters.AddWithValue("@dtend", approval.EndDate);
                await command.ExecuteNonQueryAsync();
            }

            // UpdateHsFromRetro (only if needed)
            if (approval.Results.Any(r => r.CollectionDate == null))
            {
                using (var command = new SqlCommand("[dbo].[UpdateHsFromRetro]", connection))
                {
                    command.Transaction = transaction as SqlTransaction;
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@jobnum", approval.JobNumber);
                    command.Parameters.AddWithValue("@dtstart", approval.StartDate);
                    await command.ExecuteNonQueryAsync();
                }
            }

            // Clean up Temparnmforat
            using (var command = new SqlCommand("DELETE FROM Temparnmforat WHERE jobnum = @jobnum", connection))
            {
                command.Transaction = transaction as SqlTransaction;
                command.Parameters.AddWithValue("@jobnum", approval.JobNumber);
                await command.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving retro for property {PropertyId}", approval.PropertyId);
            if (transaction != null)
            {
                await transaction.RollbackAsync();
            }
            return false;
        }
    }
}