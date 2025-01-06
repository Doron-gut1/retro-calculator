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

            return Content($@"<!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Retro Calculator</title>
                    <script>
                        // Store Access parameters
                        localStorage.setItem('odbc_name', '{odbcName}');
                        localStorage.setItem('job_num', '{jobNum}');
                        localStorage.setItem('from_access', 'true');
                        
                        // Navigate to main app
                        window.location.href = '/';

                        // Setup window close handler
                        window.onbeforeunload = function() {{
                            if(window.opener) {{
                                window.opener.location.reload();
                            }}
                        }};
                    </script>
                </head>
                <body dir='rtl'>
                    <p>טוען את המערכת...</p>
                </body>
                </html>", "text/html");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error opening from Access");
            return Content($@"<!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>שגיאה</title>
                </head>
                <body dir='rtl'>
                    <h1>שגיאה</h1>
                    <p>{ex.Message}</p>
                    <script>
                        setTimeout(() => {{
                            if(window.opener) {{
                                window.close();
                            }}
                        }}, 5000);
                    </script>
                </body>
                </html>", "text/html");
        }
    }
}