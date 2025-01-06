using System.Data;
using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService : IDisposable
{
    Task<DataTable> CalculateRetroAsync(RetroCalculationRequest request, string odbcName);
}