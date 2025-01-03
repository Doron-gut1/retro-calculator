namespace RetroCalculator.Api.Services.Interfaces;

public interface ICalculationService
{
    Task<bool> PerformCalculation(string propertyId);
}