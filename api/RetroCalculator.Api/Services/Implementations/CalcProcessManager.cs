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

    [DllImport("CalcArnProcess.dll", CallingConvention = CallingConvention.StdCall, EntryPoint = "CalcArnProcessManager")]
    private static extern bool CalcRetroProcessManager(
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
                "Starting retro calculation: ODBC={OdbcName}, Job={JobNum}, Property={PropertyId}",
                odbcName, jobNum, propertyId);

            return await Task.Run(() =>
                CalcRetroProcessManager(
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
            _logger.LogError(ex, "Error executing DLL function");
            throw;
        }
    }
}