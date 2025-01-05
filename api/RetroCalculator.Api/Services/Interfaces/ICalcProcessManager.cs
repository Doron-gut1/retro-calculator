namespace RetroCalculator.Api.Services.Interfaces;

public interface ICalcProcessManager
{
    /// <summary>
    /// מפעיל את תהליך החישוב של הרטרו
    /// </summary>
    /// <param name="odbcName">שם חיבור ה-ODBC</param>
    /// <param name="userName">שם המשתמש (לא בשימוש)</param>
    /// <param name="jobNum">מזהה התהליך</param>
    /// <param name="processType">סוג התהליך (תמיד 1)</param>
    /// <param name="propertyId">מספר הנכס</param>
    /// <returns>האם החישוב הצליח</returns>
    Task<bool> CalculateRetroAsync(
        string odbcName,
        string userName,
        int jobNum,
        int processType,
        string propertyId);
}