using RetroCalculator.Api.Models;
using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    /// <summary>
    /// מבצע חישוב רטרו לנכס
    /// </summary>
    /// <param name="request">נתוני הבקשה (נכס, תאריכים, סוגי חיוב, גדלים ותעריפים)</param>
    /// <param name="odbcName">שם חיבור ה-ODBC</param>
    /// <returns>תוצאות החישוב</returns>
    Task<IEnumerable<TempArnmforat>> CalculateRetroAsync(
        RetroCalculationRequest request,
        string odbcName);

    /// <summary>
    /// מחזיר את תוצאות החישוב לנכס ותהליך ספציפיים
    /// </summary>
    /// <param name="propertyId">מזהה הנכס</param>
    /// <param name="jobNum">מזהה התהליך</param>
    /// <param name="odbcName">שם חיבור ה-ODBC</param>
    /// <returns>תוצאות החישוב</returns>
    Task<IEnumerable<TempArnmforat>> GetRetroResultsAsync(
        string propertyId,
        int jobNum,
        string odbcName);
}