using System.Runtime.InteropServices;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

// המחלקה שמייצגת את ClsReturn
public class RetroResult
{
    public int StatusCode { get; set; }
    public string StatusText { get; set; }
    public object Data { get; set; }
    public object Error { get; set; }
}

public class CalcProcessManager : ICalcProcessManager
{
    private readonly ILogger<CalcProcessManager> _logger;
    private readonly string _dllPath;
    private dynamic _retroInstance;

    public CalcProcessManager(ILogger<CalcProcessManager> logger, IWebHostEnvironment environment)
    {
        _logger = logger;
        _dllPath = Path.Combine(environment.ContentRootPath, "CalcArnProcess.dll");

        if (!File.Exists(_dllPath))
        {
            throw new FileNotFoundException($"DLL not found at {_dllPath}");
        }
    }

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

            // טעינת ה-DLL באופן דינמי
            var assembly = System.Reflection.Assembly.LoadFrom(_dllPath);
            var retroType = assembly.GetType("CalcArnProcess.Retro");

            if (retroType == null)
            {
                throw new InvalidOperationException("Could not find Retro type in DLL");
            }

            // יצירת מופע חדש
            _retroInstance = Activator.CreateInstance(retroType,
                90, // moazaCode
                userName,
                odbcName,
                jobNum,
                processType,
                propertyId);

            // קריאה לפונקציה CalculateRetro
            dynamic result = _retroInstance.CalculateRetro();

            // בדיקת התוצאה
            (bool Success, string ErrorDescription) success = result;
            if (!success.Success)
            {
               // _logger.LogError("Retro calculation failed: {Error}", result.ErrorDescription);
            }

            return success.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing retro calculation");
            throw;
        }
    }
}