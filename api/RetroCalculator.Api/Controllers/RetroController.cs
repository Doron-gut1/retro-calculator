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
    public async Task<ActionResult<object>> CalculateRetro(
        [FromBody] RetroCalculationRequest request)
    {
        try
        {
            // Basic validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var results = await _retroService.CalculateRetroAsync(request, DefaultOdbcName);
            
            // Convert DataTable to a more JSON-friendly format
            var jsonResults = new
            {
                Rows = from DataRow row in results.Rows
                       select results.Columns.Cast<DataColumn>().ToDictionary(
                           column => column.ColumnName,
                           column => row[column]?.ToString()
                       )
            };

            return Ok(jsonResults);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Validation error in retro calculation for property {PropertyId}", request.PropertyId);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating retro for property {PropertyId}", request.PropertyId);
            return StatusCode(500, new { error = "Failed to calculate retro", details = ex.Message });
        }
    }
}