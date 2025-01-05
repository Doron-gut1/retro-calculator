using Microsoft.AspNetCore.Mvc;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RetroController : ControllerBase
{
    private readonly IRetroService _retroService;
    private readonly IPropertyService _propertyService;
    private readonly ILogger<RetroController> _logger;

    public RetroController(
        IRetroService retroService,
        IPropertyService propertyService,
        ILogger<RetroController> logger)
    {
        _retroService = retroService;
        _propertyService = propertyService;
        _logger = logger;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<List<RetroCalculationResultDto>>> Calculate(RetroCalculationRequestDto calculation)
    {
        try
        {
            var isLocked = await _propertyService.IsPropertyLockedAsync(calculation.PropertyId);
            if (isLocked)
            {
                return BadRequest("Property is currently locked by another calculation");
            }

            var results = await _retroService.CalculateRetroAsync(calculation);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro for property {PropertyId}", calculation.PropertyId);
            return StatusCode(500, "Internal server error");
        }
    }

    // TODO: Approval process will be implemented later
    // [HttpPost("approve")]
    // public async Task<ActionResult> Approve(...)
}