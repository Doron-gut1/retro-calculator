using System.Runtime.InteropServices;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class CalcProcessManager : ICalcProcessManager
{
    private readonly ILogger<CalcProcessManager> _logger;
    private readonly string _dllPath;

    public CalcProcessManager(ILogger<CalcProcessManager> logger, IWebHostEnvironment environment)
    {
        _logger = logger;
        _dllPath = Path.Combine(environment.ContentRootPath, "lib", "CalcRetroProcessManager.dll");

        if (!File.Exists(_dllPath))
        {
            throw new FileNotFoundException($"DLL not found at {_dllPath}");
        }

        _logger.LogInformation("DLL found at {Path}", _dllPath);
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern IntPtr LoadLibrary(string lpFileName);

    [DllImport("kernel32.dll")]
    private static extern IntPtr GetProcAddress(IntPtr hModule, string procName);

    [DllImport("kernel32.dll")]
    private static extern bool FreeLibrary(IntPtr hModule);

    private delegate bool CalcRetroProcessManagerDelegate(
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
        _logger.LogInformation(
            "Starting retro calculation: ODBC={OdbcName}, JobNum={JobNum}, PropertyId={PropertyId}",
            odbcName, jobNum, propertyId);

        var dllHandle = IntPtr.Zero;

        try
        {
            // טעינת ה-DLL
            dllHandle = LoadLibrary(_dllPath);
            if (dllHandle == IntPtr.Zero)
            {
                var error = Marshal.GetLastWin32Error();
                throw new InvalidOperationException($"Failed to load DLL. Error: {error}");
            }

            // קבלת כתובת הפונקציה
            var procAddress = GetProcAddress(dllHandle, "CalcRetroProcessManager");
            if (procAddress == IntPtr.Zero)
            {
                throw new InvalidOperationException("Failed to get function address");
            }

            // יצירת delegate לפונקציה
            var calcDelegate = Marshal.GetDelegateForFunctionPointer<CalcRetroProcessManagerDelegate>(procAddress);

            // הפעלת החישוב
            return await Task.Run(() =>
                calcDelegate(
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
            _logger.LogError(ex, "Error executing DLL calculation");
            throw;
        }
        finally
        {
            if (dllHandle != IntPtr.Zero)
            {
                FreeLibrary(dllHandle);
            }
        }
    }
}