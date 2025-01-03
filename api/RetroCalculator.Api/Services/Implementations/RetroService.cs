using Microsoft.Data.SqlClient;
using RetroCalculator.Api.Models;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroService : IRetroService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RetroService> _logger;
    private readonly ICalculationService _calculationService;

    public RetroService(IConfiguration configuration, ILogger<RetroService> logger, ICalculationService calculationService)
    {
        _configuration = configuration;
        _logger = logger;
        _calculationService = calculationService;
    }

    public async Task<List<RetroResultDto>> CalculateRetroAsync(RetroCalculationDto calculation)
    {
        using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await connection.OpenAsync();

        // 1. נקה נתונים קודמים
        await ClearPreviousCalculations(connection, calculation.PropertyId);

        // 2. הכנס נתוני חישוב חדשים
        await InsertCalculationData(connection, calculation);

        // 3. הרץ את החישוב
        var results = await _calculationService.PerformCalculation(calculation.PropertyId);

        // 4. החזר תוצאות
        return await GetCalculationResults(connection, calculation.PropertyId);
    }

    public async Task<bool> ApproveRetroAsync(string propertyId, List<RetroResultDto> results)
    {
        using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await connection.OpenAsync();

        using var transaction = await connection.BeginTransactionAsync();

        try
        {
            // 1. וודא שהחישוב תואם לתוצאות שאושרו
            var currentResults = await GetCalculationResults(connection, propertyId);
            if (!ValidateResults(currentResults, results))
            {
                throw new InvalidOperationException("Results mismatch");
            }

            // 2. עדכן את הסטטוס בטבלאות
            await UpdateCalculationStatus(connection, propertyId, transaction);

            // 3. שמור את התוצאות
            await SaveFinalResults(connection, propertyId, results, transaction);

            await transaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving retro calculation");
            await transaction.RollbackAsync();
            return false;
        }
    }

    private async Task ClearPreviousCalculations(SqlConnection connection, string propertyId)
    {
        var command = new SqlCommand("DELETE FROM Temparnmforat WHERE hs = @PropertyId", connection);
        command.Parameters.AddWithValue("@PropertyId", propertyId);
        await command.ExecuteNonQueryAsync();
    }

    private async Task InsertCalculationData(SqlConnection connection, RetroCalculationDto calculation)
    {
        // הכנסת נתוני החישוב לטבלה הזמנית
        var command = new SqlCommand(@"
            INSERT INTO Temparnmforat (hs, mspkod, sugts, hdtme, hdtad, jobnum, gdl1, trf1, gdl2, trf2)
            VALUES (@PropertyId, @PayerId, @ChargeType, @StartDate, @EndDate, @JobNum, @Size1, @Tariff1, @Size2, @Tariff2)",
            connection);

        // מילוי פרמטרים בסיסיים
        command.Parameters.AddWithValue("@PropertyId", calculation.PropertyId);
        command.Parameters.AddWithValue("@StartDate", calculation.StartDate);
        command.Parameters.AddWithValue("@EndDate", calculation.EndDate);
        command.Parameters.AddWithValue("@JobNum", await GetNextJobNumber(connection));

        // הוספת גדלים ותעריפים
        foreach (var sizeAndTariff in calculation.SizesAndTariffs.Take(2)) // נניח שיש לנו מקום ל-2 ערכים
        {
            var index = calculation.SizesAndTariffs.IndexOf(sizeAndTariff) + 1;
            command.Parameters.AddWithValue($"@Size{index}", sizeAndTariff.Size);
            command.Parameters.AddWithValue($"@Tariff{index}", sizeAndTariff.TariffCode);
        }

        await command.ExecuteNonQueryAsync();
    }

    private async Task<List<RetroResultDto>> GetCalculationResults(SqlConnection connection, string propertyId)
    {
        var results = new List<RetroResultDto>();

        var command = new SqlCommand(@"
            SELECT mnt, sugts, paysum, sumhan, paysum - sumhan as total
            FROM Temparnmforat
            WHERE hs = @PropertyId
            ORDER BY mnt", connection);

        command.Parameters.AddWithValue("@PropertyId", propertyId);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(new RetroResultDto
            {
                Period = reader.GetInt32(0).ToString(), // מספר חודש
                ChargeType = reader.GetInt32(1).ToString(), // סוג חיוב
                Amount = reader.GetDecimal(2), // סכום לתשלום
                Discount = reader.GetDecimal(3), // הנחה
                Total = reader.GetDecimal(4) // סה"כ
            });
        }

        return results;
    }

    private bool ValidateResults(List<RetroResultDto> current, List<RetroResultDto> approved)
    {
        if (current.Count != approved.Count) return false;

        for (int i = 0; i < current.Count; i++)
        {
            if (current[i].Total != approved[i].Total ||
                current[i].Period != approved[i].Period ||
                current[i].ChargeType != approved[i].ChargeType)
            {
                return false;
            }
        }

        return true;
    }

    private async Task UpdateCalculationStatus(SqlConnection connection, string propertyId, SqlTransaction transaction)
    {
        var command = new SqlCommand(@"
            UPDATE Temparnmforat 
            SET status = 1, 
                dtgv = GETDATE(), 
                dtval = GETDATE()
            WHERE hs = @PropertyId", connection, transaction);

        command.Parameters.AddWithValue("@PropertyId", propertyId);
        await command.ExecuteNonQueryAsync();
    }

    private async Task SaveFinalResults(SqlConnection connection, string propertyId, List<RetroResultDto> results, SqlTransaction transaction)
    {
        // שמירת התוצאות בטבלאות הקבועות
        var command = new SqlCommand(@"
            INSERT INTO arnhist (hs, mnt, sugts, paysum, sumhan, dtgv, dtval)
            VALUES (@PropertyId, @Period, @ChargeType, @Amount, @Discount, GETDATE(), GETDATE())",
            connection, transaction);

        foreach (var result in results)
        {
            command.Parameters.Clear();
            command.Parameters.AddWithValue("@PropertyId", propertyId);
            command.Parameters.AddWithValue("@Period", int.Parse(result.Period));
            command.Parameters.AddWithValue("@ChargeType", int.Parse(result.ChargeType));
            command.Parameters.AddWithValue("@Amount", result.Amount);
            command.Parameters.AddWithValue("@Discount", result.Discount);

            await command.ExecuteNonQueryAsync();
        }
    }

    private async Task<int> GetNextJobNumber(SqlConnection connection)
    {
        var command = new SqlCommand("SELECT MAX(jobnum) + 1 FROM Temparnmforat", connection);
        var result = await command.ExecuteScalarAsync();
        return result == DBNull.Value ? 1 : Convert.ToInt32(result);
    }
}