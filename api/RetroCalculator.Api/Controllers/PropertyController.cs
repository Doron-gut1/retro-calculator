using Microsoft.AspNetCore.Mvc;
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
    public async Task<ActionResult<PropertyDto>> Get(string id, [FromQuery] string odbcName)
    {
        try
        {
            _logger.LogInformation($"Getting property {id} with ODBC {odbcName}");
            var property = await _propertyService.GetPropertyAsync(id, odbcName);
            return Ok(property);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting property {id} with ODBC {odbcName}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    [HttpGet("{id}/validate")]
    public async Task<ActionResult<bool>> Validate(string id, [FromQuery] string odbcName)
    {
        try
        {
            _logger.LogInformation($"Validating property {id} with ODBC {odbcName}");
            var isValid = await _propertyService.ValidatePropertyAsync(id, odbcName);
            return Ok(isValid);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error validating property {id} with ODBC {odbcName}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}