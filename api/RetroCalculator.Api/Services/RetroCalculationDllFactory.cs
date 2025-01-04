using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services;

public class RetroCalculationDllFactory : IRetroCalculationDllFactory
{
    private readonly IConfiguration _configuration;

    public RetroCalculationDllFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IRetroCalculationDll Create(string odbcConnectionString, int jobNumber, string propertyId = "")
    {
        try
        {
            // TODO: Load DLL and create instance
            // var assembly = Assembly.LoadFrom("path_to_dll/CalcArnProcessManager.dll");
            // var retroType = assembly.GetType("Namespace.Retro");
            // var instance = Activator.CreateInstance(retroType,
            //     moazaCode: _configuration.GetValue<int>("RetroCalculation:MoazaCode"),
            //     userName: "system",
            //     odbcName: odbcConnectionString,
            //     Jobnum: jobNumber,
            //     processType: 1,
            //     Hskod: propertyId);

            // return new RetroCalculationDllWrapper(instance);
            throw new NotImplementedException("DLL integration not implemented yet");
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to create DLL instance", ex);
        }
    }
}