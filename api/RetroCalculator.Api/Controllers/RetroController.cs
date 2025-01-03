using Microsoft.AspNetCore.Mvc;
using RetroCalculator.Api.Models;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RetroController : ControllerBase
{
    private readonly IRetroService _retroService;
    private readonly ILogger<RetroController> _logger;

    public RetroController(IRetroService retroService, ILogger<RetroController> logger)
    {
        _retroService = retroService;
        _logger = logger;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<List<RetroResultDto>>> Calculate(RetroCalculationDto calculation)
    {
        try
        {
            var results = await _retroService.CalculateRetroAsync(calculation);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro for property {PropertyId}", calculation.PropertyId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{propertyId}/approve")]
    public async Task<ActionResult> Approve(string propertyId, [FromBody] List<RetroResultDto> results)
    {
        try
        {
            var success = await _retroService.ApproveRetroAsync(propertyId, results);
            if (!success)
            {
                return BadRequest("Failed to approve retro calculation");
            }
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving retro for property {PropertyId}", propertyId);
            return StatusCode(500, "Internal server error");
        }
    }
}