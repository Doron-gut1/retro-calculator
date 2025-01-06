using System.Runtime.InteropServices;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroResult
{
    public int StatusCode { get; set; }
    public required string StatusText { get; set; }
    public required object Data { get; set; }
    public required object Error { get; set; }

    public RetroResult()
    {
        StatusText = string.Empty;
        Data = new object();
        Error = new object();
    }
}

public class CalcProcessManager : ICalcProcessManager
{
    private readonly ILogger<CalcProcessManager> _logger;
    private readonly string _dllPath;
    private dynamic? _retroInstance;
    private bool _disposed;

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
            await Task.Yield(); // Make method truly async
            
            _logger.LogInformation(
                "Starting retro calculation: ODBC={OdbcName}, Job={JobNum}, Property={PropertyId}",
                odbcName, jobNum, propertyId);

            var assembly = System.Reflection.Assembly.LoadFrom(_dllPath);
            var retroType = assembly.GetType("CalcArnProcess.Retro");

            if (retroType == null)
            {
                throw new InvalidOperationException("Could not find Retro type in DLL");
            }

            _retroInstance = Activator.CreateInstance(retroType,
                90, // moazaCode
                userName,
                odbcName,
                jobNum,
                processType,
                propertyId);

            if (_retroInstance == null)
            {
                throw new InvalidOperationException("Failed to create Retro instance");
            }

            dynamic result = _retroInstance.CalculateRetro();
            (bool Success, string ErrorDescription) success = result;

            if (!success.Success)
            {
                _logger.LogError("Retro calculation failed: {Error}", success.ErrorDescription);
            }

            return success.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing retro calculation");
            throw;
        }
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            if (_retroInstance != null)
            {
                try
                {
                    // Attempt to dispose the retro instance if it implements IDisposable
                    (_retroInstance as IDisposable)?.Dispose();
                    _retroInstance = null;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error disposing retro instance");
                }
            }
            _disposed = true;
            GC.SuppressFinalize(this);
        }
    }
}