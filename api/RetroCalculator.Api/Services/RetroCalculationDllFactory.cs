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
        // TODO: Implement DLL loading and instance creation
        throw new NotImplementedException("DLL integration not implemented yet");
    }
}