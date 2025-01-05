using System.Runtime.InteropServices;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class CalcProcessManager : ICalcProcessManager
{
    private readonly ILogger<CalcProcessManager> _logger;
    private const int MOAZA_CODE = 90;

    public CalcProcessManager(ILogger<CalcProcessManager> logger)
    {
        _logger = logger;
    }

    [DllImport("CalcArnProcess", CallingConvention = CallingConvention.StdCall, EntryPoint = "CalcArnProcessManager")]
    private static extern bool CalcArnProcessManager(
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
            return await Task.Run(() =>
                CalcArnProcessManager(
                    MOAZA_CODE,
                    userName,
                    odbcName,
                    jobNum,
                    processType,
                    propertyId
                ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro: ODBC={OdbcName}, Job={JobNum}, Property={PropertyId}",
                odbcName, jobNum, propertyId);
            throw;
        }
    }
}