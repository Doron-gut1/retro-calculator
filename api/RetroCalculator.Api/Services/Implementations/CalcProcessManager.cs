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

        // בדוק אם הקובץ קיים
        if (!File.Exists(_dllPath))
        {
            throw new FileNotFoundException($"DLL not found at {_dllPath}");
        }

        // נסה לטעון את ה-DLL לבדיקה
        try
        {
            var handle = LoadLibrary(_dllPath);
            if (handle == IntPtr.Zero)
            {
                var error = Marshal.GetLastWin32Error();
                throw new InvalidOperationException(
                    $"Failed to load DLL. Error: {error}. " +
                    $"This might indicate missing dependencies. " +
                    $"Current directory: {Directory.GetCurrentDirectory()}");
            }
            FreeLibrary(handle);
            _logger.LogInformation("Successfully validated DLL loading at startup");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating DLL at startup");
            throw;
        }
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
                _logger.LogError("Failed to load DLL. Win32 Error: {Error}", error);
                throw new InvalidOperationException($"Failed to load DLL. Error: {error}");
            }

            // קבלת כתובת הפונקציה
            var procAddress = GetProcAddress(dllHandle, "CalcRetroProcessManager");
            if (procAddress == IntPtr.Zero)
            {
                _logger.LogError("Failed to get function address");
                throw new InvalidOperationException("Failed to get function address");
            }

            // יצירת delegate לפונקציה
            var calcDelegate = Marshal.GetDelegateForFunctionPointer<CalcRetroProcessManagerDelegate>(procAddress);

            _logger.LogInformation("Starting calculation with DLL");
            // הפעלת החישוב
            var result = await Task.Run(() =>
                calcDelegate(
                    90, // קוד מועצה קבוע
                    userName,
                    odbcName,
                    jobNum,
                    processType,
                    propertyId
                ));

            _logger.LogInformation("DLL calculation completed with result: {Result}", result);
            return result;
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