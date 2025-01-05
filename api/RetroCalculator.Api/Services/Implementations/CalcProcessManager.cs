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

    // מייבא את הפונקציה מה-DLL
    [DllImport("CalcArnProcess.dll", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
    private static extern bool CalcRetroProcessManager(
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
                "Starting calculation with parameters: ODBC={OdbcName}, User={UserName}, Job={JobNum}, Property={PropertyId}",
                odbcName, userName, jobNum, propertyId);

            // הרצת החישוב ב-thread נפרד
            var result = await Task.Run(() =>
                CalcRetroProcessManager(
                    90, // קוד מועצה קבוע
                    userName,
                    odbcName,
                    jobNum,
                    processType,
                    propertyId
                ));

            _logger.LogInformation(
                "Calculation completed for property {PropertyId} with result: {Result}",
                propertyId, result);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to execute calculation for property {PropertyId}", propertyId);
            throw;
        }
    }
}