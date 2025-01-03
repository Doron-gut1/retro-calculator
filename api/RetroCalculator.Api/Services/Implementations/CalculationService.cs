using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Services.Implementations;

public class CalculationService : ICalculationService
{
    private readonly ILogger<CalculationService> _logger;

    public CalculationService(ILogger<CalculationService> logger)
    {
        _logger = logger;
    }

    public async Task<bool> PerformCalculation(string propertyId)
    {
        try
        {
            // טעינת ה-DLL והפעלת הפונקציה הנדרשת
            dynamic calcManager = Activator.CreateInstance(Type.GetTypeFromProgID("CalcArnProcessManager"));
            
            // הפעלת הפונקציה הנדרשת
            calcManager.CalcRetroProcessManager("SYSTEM", "SYSTEM", 1, 1, propertyId);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בהפעלת CalcArnProcessManager");
            return false;
        }
    }
}