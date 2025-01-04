namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroCalculationDll
{
    (bool Success, string ErrorDescription) CalculateRetro();
    void Dispose();
}

public interface IRetroCalculationDllFactory
{
    IRetroCalculationDll Create(
        string odbcConnectionString,
        int jobNumber,
        string propertyId = "");
}