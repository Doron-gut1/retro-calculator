using System.Data;
using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IRetroService : IDisposable
{
    Task<DataTable> CalculateRetroAsync(RetroCalculationRequestDto request, string odbcName);
    bool ValidateOdbcConnection(string odbcName);
}