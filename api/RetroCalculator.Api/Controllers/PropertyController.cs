using Microsoft.AspNetCore.Mvc;
using RetroCalculator.Api.Models;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertyController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly ILogger<PropertyController> _logger;

    public PropertyController(IPropertyService propertyService, ILogger<PropertyController> logger)
    {
        _propertyService = propertyService;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDto>> GetProperty(string id)
    {
        try
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            if (property == null)
            {
                return NotFound();
            }
            return Ok(property);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting property {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/validate")]
    public async Task<ActionResult<bool>> ValidateProperty(string id)
    {
        try
        {
            var isValid = await _propertyService.ValidatePropertyAsync(id);
            return Ok(isValid);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating property {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}