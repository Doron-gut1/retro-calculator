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

    public RetroController(
        IRetroService retroService,
        ILogger<RetroController> logger)
    {
        _retroService = retroService;
        _logger = logger;
    }

    [HttpGet("hkarn-options")]
    public ActionResult<IEnumerable<object>> GetHkarnOptions()
    {
        var options = new[]
        {
            new { Value = 0, Label = "ללא הסדר" },
            new { Value = 1, Label = "ה.ק." },
            new { Value = 7, Label = "ה.ק.באשראי" },
            new { Value = 3, Label = "ה.ק. דרך הישוב" }
        };

        return Ok(options);
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<object>> CalculateRetro(
        [FromBody] RetroCalculationRequestDto request,
        [FromQuery] string odbcName)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(odbcName))
            {
                return BadRequest(new { error = "ODBC name is required" });
            }

            var results = await _retroService.CalculateRetroAsync(request, odbcName);
            
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

    [HttpGet("open-from-access")]
    public ActionResult OpenFromAccess(
        [FromQuery] string odbcName,
        [FromQuery] int jobNum)
    {
        try 
        {
            _logger.LogInformation(
                "Opening from Access: odbc={OdbcName}, job={JobNum}",
                odbcName, jobNum);

            // בדיקת תקינות ה-ODBC
            if (!_retroService.ValidateOdbcConnection(odbcName))
            {
                return BadRequest(new { error = "Invalid ODBC connection" });
            }

            // במקום Redirect, מחזירים הצלחה - הפרונט כבר פתוח
            return Ok(new { 
                success = true,
                odbcName = odbcName,
                jobNum = jobNum
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating ODBC connection");
            return BadRequest(new { error = "Failed to validate ODBC connection" });
        }
    }
}