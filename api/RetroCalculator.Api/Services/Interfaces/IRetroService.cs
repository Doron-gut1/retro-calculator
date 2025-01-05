using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    Task<List<RetroCalculationResultDto>> CalculateRetroAsync(RetroCalculationRequestDto calculation);
    // TODO: Approval process will be implemented later
    // Task<bool> ApproveRetroAsync(...);
}