using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    Task<IEnumerable<RetroCalculationResultDto>> CalculateRetroAsync(RetroCalculationRequestDto request, string odbcName);
    Task<IEnumerable<RetroCalculationResultDto>> GetRetroResultsAsync(string propertyId, int jobNum, string odbcName);
}