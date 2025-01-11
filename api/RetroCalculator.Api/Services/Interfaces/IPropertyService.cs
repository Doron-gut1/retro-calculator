using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IPropertyService
{
    Task<PropertyDto> GetPropertyAsync(string id, string odbcName);
    Task<bool> ValidatePropertyAsync(string id, string odbcName);
    Task<bool> IsPropertyLockedAsync(string id);
    Task<List<TariffDto>> GetTariffsAsync(string odbcName);
}