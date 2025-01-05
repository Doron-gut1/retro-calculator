namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroCalculationDll : IDisposable
{
    (bool Success, string ErrorDescription) CalculateRetro();
}

public interface IRetroCalculationDllFactory
{
    IRetroCalculationDll Create(string odbcConnectionString, int jobNumber, string propertyId = "");
}