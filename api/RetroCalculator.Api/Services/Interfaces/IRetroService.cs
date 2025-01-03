using RetroCalculator.Api.Models;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    Task<List<RetroResultDto>> CalculateRetroAsync(RetroCalculationDto calculation);
    Task<bool> ApproveRetroAsync(string propertyId, List<RetroResultDto> results);
}