using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    Task<List<RetroCalculationResultDto>> CalculateRetroAsync(RetroCalculationRequestDto calculation);
    Task<bool> ApproveRetroAsync(RetroApprovalDto approval);
}