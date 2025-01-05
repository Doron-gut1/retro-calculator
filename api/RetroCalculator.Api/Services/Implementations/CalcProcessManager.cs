using System.Runtime.InteropServices;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class CalcProcessManager : ICalcProcessManager
{
    private readonly ILogger<CalcProcessManager> _logger;

    public CalcProcessManager(ILogger<CalcProcessManager> logger)
    {
        _logger = logger;
    }

    [DllImport("CalcRetroProcessManager.dll", CallingConvention = CallingConvention.StdCall)]
    private static extern bool CalcRetroProcessManagerFunc(
        int moazaCode,
        string userName,
        string odbcName,
        int jobNum,
        int processType,
        string propertyId);

    public async Task<bool> CalculateRetroAsync(
        string odbcName,
        string userName,
        int jobNum,
        int processType,
        string propertyId)
    {
        try
        {
            _logger.LogInformation(
                "Starting calculation: ODBC={OdbcName}, Job={JobNum}, Property={PropertyId}",
                odbcName, jobNum, propertyId);

            var result = await Task.Run(() =>
                CalcRetroProcessManagerFunc(
                    90,
                    userName,
                    odbcName,
                    jobNum,
                    processType,
                    propertyId
                ));

            _logger.LogInformation("Calculation completed with result: {Result}", result);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in calculation");
            throw;
        }
    }
}