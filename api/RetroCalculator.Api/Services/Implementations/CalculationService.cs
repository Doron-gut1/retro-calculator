using System.Data.SqlClient;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class CalculationService : ICalculationService
{
    private readonly ILogger<CalculationService> _logger;
    private readonly string _connectionString;
    private readonly IRetroCalculationDllFactory _dllFactory;

    public CalculationService(
        ILogger<CalculationService> logger,
        IConfiguration configuration,
        IRetroCalculationDllFactory dllFactory)
    {
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string is missing");
        _dllFactory = dllFactory;
    }

    public async Task InitializeCalculationAsync(string propertyId, int jobNumber)
    {
        await using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // Clear existing calculations
        using (var command = new SqlCommand(
            "DELETE FROM Temparnmforat WHERE hs = @propertyId", connection))
        {
            command.Parameters.AddWithValue("@propertyId", propertyId);
            await command.ExecuteNonQueryAsync();
        }

        // Get property details
        using (var command = new SqlCommand(@"
            SELECT mspkod FROM hs WHERE hskod = @propertyId", connection))
        {
            command.Parameters.AddWithValue("@propertyId", propertyId);
            var result = await command.ExecuteScalarAsync();
            var mspkod = result != null ? Convert.ToInt32(result) : throw new InvalidOperationException($"Property {propertyId} not found");

            // Initialize calculation
            using var initCommand = new SqlCommand(@"
                INSERT INTO Temparnmforat (hs, mspkod, sugts, hdtme, hdtad, jobnum)
                VALUES (@propertyId, @mspkod, 1010, @date, @date, @jobnum)", connection);

            initCommand.Parameters.AddWithValue("@propertyId", propertyId);
            initCommand.Parameters.AddWithValue("@mspkod", mspkod);
            initCommand.Parameters.AddWithValue("@date", DateTime.Today);
            initCommand.Parameters.AddWithValue("@jobnum", jobNumber);

            await initCommand.ExecuteNonQueryAsync();
        }
    }

    public async Task<bool> RunRetroCalculationAsync(int jobNumber, string odbcConnectionString)
    {
        try
        {
            // Run DLL operation in a background thread since it's a CPU-bound operation
            var result = await Task.Run(() =>
            {
                using var dll = _dllFactory.Create(odbcConnectionString, jobNumber);
                return dll.CalculateRetro();
            });

            if (!result.Success)
            {
                _logger.LogError("DLL calculation failed: {Error}", result.ErrorDescription);
            }

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error running retro calculation for job {JobNumber}", jobNumber);
            return false;
        }
    }

    public async Task<bool> ValidatePeriodAsync(DateTime startDate, DateTime endDate)
    {
        await using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        using var command = new SqlCommand(@"
            SELECT COUNT(*) 
            FROM sagur 
            WHERE mnt BETWEEN 
                dbo.GetMntByDate(@startDate) AND 
                dbo.GetMntByDate(@endDate)", connection);

        command.Parameters.AddWithValue("@startDate", startDate);
        command.Parameters.AddWithValue("@endDate", endDate);

        var result = await command.ExecuteScalarAsync();
        var count = result != null ? Convert.ToInt32(result) : 0;
        return count > 0;
    }
}