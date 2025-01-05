using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class RetroCalculationDllWrapper : IRetroCalculationDll
{
    private readonly dynamic _retroInstance;
    private bool _disposed;

    public RetroCalculationDllWrapper(
        dynamic retroInstance)
    {
        _retroInstance = retroInstance;
    }

    public (bool Success, string ErrorDescription) CalculateRetro()
    {
        try
        {
            // Call the DLL's CalculateRetro method
            var result = _retroInstance.CalculateRetro();
            return ((bool)result.Success, (string)result.ErrorDescription);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            if (_retroInstance is IDisposable disposable)
            {
                disposable.Dispose();
            }
            _disposed = true;
        }
    }
}