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

    // הפונקציה ב-DLL החיצוני
    [DllImport("CalcRetroProcessManager.dll", EntryPoint = "CalcRetroProcessManager", CharSet = CharSet.Ansi)]
    private static extern bool CalcRetroProcessManagerInternal(
        int moazaCode,
        [MarshalAs(UnmanagedType.LPStr)] string userName,
        [MarshalAs(UnmanagedType.LPStr)] string odbcName,
        int jobNum,
        int processType,
        [MarshalAs(UnmanagedType.LPStr)] string propertyId);

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

            return await Task.Run(() =>
                CalcRetroProcessManagerInternal(
                    90, // קוד מועצה קבוע
                    userName,
                    odbcName,
                    jobNum,
                    processType,
                    propertyId
                ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing DLL function");
            throw;
        }
    }
}