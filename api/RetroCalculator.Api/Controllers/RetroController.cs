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
                    <title>מחשבון רטרו</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding-top: 50px;
                            background-color: #f5f5f5;
                        }}
                        .container {{
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }}
                        .loader {{
                            margin: 20px auto;
                            border: 4px solid #f3f3f3;
                            border-radius: 50%;
                            border-top: 4px solid #3498db;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                        }}
                        @keyframes spin {{
                            0% {{ transform: rotate(0deg); }}
                            100% {{ transform: rotate(360deg); }}
                        }}
                        .param-value {{
                            font-weight: bold;
                            color: #3498db;
                        }}
                    </style>
                    <script>
                        // Store Access parameters
                        localStorage.setItem('odbc_name', '{odbcName}');
                        localStorage.setItem('job_num', '{jobNum}');
                        localStorage.setItem('from_access', 'true');
                        
                        // Navigate to main app after showing parameters
                        setTimeout(() => {{
                            window.location.href = '/retro-calculator/';
                        }}, 2000);

                        // Setup window close handler
                        window.onbeforeunload = function() {{
                            if(window.opener) {{
                                window.opener.location.reload();
                            }}
                        }};

                        // Update displayed parameters when page loads
                        window.onload = function() {{
                            document.getElementById('odbc').textContent = '{odbcName}';
                            document.getElementById('job').textContent = '{jobNum}';
                        }};
                    </script>
                </head>
                <body dir='rtl'>
                    <div class='container'>
                        <h2>טוען את מחשבון הרטרו...</h2>
                        <div class='loader'></div>
                        <p>מתחבר עם ODBC: <span id='odbc' class='param-value'></span></p>
                        <p>מספר JOB: <span id='job' class='param-value'></span></p>
                    </div>
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
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding-top: 50px;
                            background-color: #fff5f5;
                        }}
                        .error-container {{
                            max-width: 500px;
                            margin: 0 auto;
                            padding: 20px;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            border: 1px solid #ffecec;
                        }}
                        .error-message {{
                            color: #dc3545;
                        }}
                    </style>
                </head>
                <body dir='rtl'>
                    <div class='error-container'>
                        <h1>שגיאה</h1>
                        <p class='error-message'>{ex.Message}</p>
                        <script>
                            setTimeout(() => {{
                                if(window.opener) {{
                                    window.close();
                                }}
                            }}, 5000);
                        </script>
                    </div>
                </body>
                </html>", "text/html");
        }
    }
}