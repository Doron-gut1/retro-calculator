namespace RetroCalculator.Api.Infrastructure.DllServices;

public class CalcArnProcessManagerWrapper
{
    private readonly dynamic _calcManager;
    private readonly ILogger<CalcArnProcessManagerWrapper> _logger;

    public CalcArnProcessManagerWrapper(ILogger<CalcArnProcessManagerWrapper> logger)
    {
        _logger = logger;
        try
        {
            _calcManager = Activator.CreateInstance(Type.GetTypeFromProgID("CalcArnProcessManager"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בטעינת CalcArnProcessManager");
            throw;
        }
    }

    public bool CalculateRetro(string thismoz, string thisuser, int jobnum, int action, string propertyId)
    {
        try
        {
            _calcManager.CalcRetroProcessManager(thismoz, thisuser, jobnum, action, propertyId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בהפעלת CalcArnProcessManager");
            return false;
        }
    }
}