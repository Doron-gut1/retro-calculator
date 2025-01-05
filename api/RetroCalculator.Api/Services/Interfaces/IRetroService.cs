using RetroCalculator.Api.Models;
using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    Task<IEnumerable<TempArnmforat>> CalculateRetroAsync(
        RetroCalculationRequestDto request,
        string odbcName);
        
    Task<IEnumerable<TempArnmforat>> GetRetroResultsAsync(
        string propertyId,
        int jobNum,
        string odbcName);
}