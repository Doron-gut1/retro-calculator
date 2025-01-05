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
    private static extern bool CalcRetroProcessManager(
        int moazaCode,     // קוד מועצה - תמיד 90
        string userName,    // שם משתמש - לא בשימוש
        string odbcName,    // שם חיבור ODBC
        int jobNum,        // מזהה תהליך
        int processType,   // סוג תהליך - תמיד 1
        string propertyId  // מספר נכס
    );

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
                "Starting retro calculation for property {PropertyId} with job {JobNum}",
                propertyId, jobNum);

            // הפעלת ה-DLL בthread נפרד כדי לא לחסום את ה-thread הראשי
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
                "Retro calculation completed for property {PropertyId}. Success: {Result}",
                propertyId, result);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error calculating retro for property {PropertyId}",
                propertyId);
            throw;
        }
    }
}