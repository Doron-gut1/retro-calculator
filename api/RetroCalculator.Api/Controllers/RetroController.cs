using System.Data;
using Microsoft.AspNetCore.Mvc;
using RetroCalculator.Api.Models.DTOs;
using RetroCalculator.Api.Services.Interfaces;

namespace RetroCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RetroController : ControllerBase
{
    private readonly IRetroService _retroService;
    private readonly ILogger<RetroController> _logger;
    private const string DefaultOdbcName = "brngviadev";

    public RetroController(
        IRetroService retroService,
        ILogger<RetroController> logger)
    {
        _retroService = retroService;
        _logger = logger;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<DataTable>> CalculateRetro(
        [FromBody] RetroCalculationRequestDto request)
    {
        try
        {
            var results = await _retroService.CalculateRetroAsync(request, DefaultOdbcName);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro for property {PropertyId}", request.PropertyId);
            return StatusCode(500, new { error = "Failed to calculate retro", details = ex.Message });
        }
    }

    [HttpGet("{propertyId}/results/{jobNum}")]
    public async Task<ActionResult<DataTable>> GetRetroResults(
        string propertyId,
        int jobNum)
    {
        try
        {
            var results = await _retroService.GetRetroResultsAsync(propertyId, jobNum, DefaultOdbcName);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting retro results for property {PropertyId}, job {JobNum}",
                propertyId, jobNum);
            return StatusCode(500, new { error = "Failed to get retro results", details = ex.Message });
        }
    }
}