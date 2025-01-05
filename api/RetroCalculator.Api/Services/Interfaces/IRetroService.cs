using System.Data;
using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService
{
    Task<DataTable> CalculateRetroAsync(RetroCalculationRequestDto request, string odbcName);
    Task<DataTable> GetRetroResultsAsync(string propertyId, int jobNum, string odbcName);
}