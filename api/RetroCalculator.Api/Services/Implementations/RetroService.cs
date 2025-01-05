using System.Data;
using System.Data.SqlClient;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService
{
    // ... (previous code remains the same until CleanupTempData)

    private async Task CleanupTempData(SqlConnection connection, string propertyId, int jobNum)
    {
        try 
        {
            _logger.LogInformation("Starting cleanup for property {PropertyId} and job {JobNum}", propertyId, jobNum);
            
            // First try to delete by jobnum
            var jobNumCleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE jobnum = @jobnum",
                connection);
            jobNumCleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
            var deletedByJobNum = await jobNumCleanupCommand.ExecuteNonQueryAsync();
            _logger.LogInformation("Deleted {Count} rows by jobnum", deletedByJobNum);

            // Then try to delete orphaned records for this property
            var propertyCleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE hs = @hs AND (jobnum = 0 OR jobnum IS NULL)",
                connection);
            propertyCleanupCommand.Parameters.AddWithValue("@hs", propertyId);
            var deletedByProperty = await propertyCleanupCommand.ExecuteNonQueryAsync();
            _logger.LogInformation("Deleted {Count} orphaned rows for property", deletedByProperty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during cleanup for property {PropertyId} and job {JobNum}", propertyId, jobNum);
            throw new InvalidOperationException($"Failed to cleanup temporary data: {ex.Message}", ex);
        }
    }

    // ... (rest of the code remains the same)
}