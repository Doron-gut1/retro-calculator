using RetroCalculator.Api.Models;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IPropertyService
{
    Task<PropertyDto?> GetPropertyByIdAsync(string id);
    Task<bool> ValidatePropertyAsync(string id);
}