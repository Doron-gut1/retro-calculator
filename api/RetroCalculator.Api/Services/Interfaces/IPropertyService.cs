using RetroCalculator.Api.Models;
using RetroCalculator.Api.Models.DTOs;

namespace RetroCalculator.Api.Services.Interfaces;

public interface IPropertyService
{
    Task<PropertyDto?> GetPropertyByIdAsync(string id);
    Task<bool> ValidatePropertyAsync(string id);
    Task<bool> IsPropertyLockedAsync(string propertyId);
}