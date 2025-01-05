namespace RetroCalculator.Api.Services.Interfaces;

public interface ICalculationService
{
    Task InitializeCalculationAsync(string propertyId, int jobNumber);
    Task<bool> RunRetroCalculationAsync(int jobNumber, string odbcConnectionString);
    Task<bool> ValidatePeriodAsync(DateTime startDate, DateTime endDate);
}