using System.Reflection;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroCalculationDllFactory : IRetroCalculationDllFactory
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RetroCalculationDllFactory> _logger;

    public RetroCalculationDllFactory(IConfiguration configuration, ILogger<RetroCalculationDllFactory> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public IRetroCalculationDll Create(string odbcConnectionString, int jobNumber, string propertyId = "")
    {
        try
        {
            var dllPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CalcArnProcess.dll");
            var assembly = Assembly.LoadFrom(dllPath);
            var retroType = assembly.GetType("CalcArnProcessManager.Retro");

            if (retroType == null)
            {
                throw new InvalidOperationException("Could not find Retro type in assembly");
            }

            var moazaCode = _configuration.GetValue<int>("RetroCalculation:MoazaCode");
            var instance = Activator.CreateInstance(retroType, 
                moazaCode,                 // moazaCode
                "system",                   // userName
                odbcConnectionString,       // odbcName
                jobNumber,                 // Jobnum
                1,                         // processType
                propertyId                 // Hskod
            );

            if (instance == null)
            {
                throw new InvalidOperationException("Failed to create instance of Retro class");
            }

            return new RetroCalculationDllWrapper(instance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create DLL instance");
            throw;
        }
    }
}