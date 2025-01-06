namespace RetroCalculator.Api.Services.Interfaces;

public interface ICalcProcessManager : IDisposable
{
    Task<bool> CalculateRetroAsync(
        string odbcName,
        string userName,
        int jobNum,
        int processType,
        string propertyId);
}