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

    [HttpGet("calculate-from-access")]
    public async Task<ActionResult> CalculateRetroFromAccess(
        [FromQuery] string odbcName,
        [FromQuery] int jobNum,
        [FromQuery] string propertyId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try 
        {
            _logger.LogInformation(
                "Starting retro calculation from Access: odbc={OdbcName}, job={JobNum}, property={PropertyId}",
                odbcName, jobNum, propertyId);

            var request = new RetroCalculationRequestDto
            {
                PropertyId = propertyId,
                StartDate = startDate,
                EndDate = endDate,
                ChargeTypes = new List<int> { 1010 },  // ארנונה
                JobNumber = jobNum
            };

            var results = await _retroService.CalculateRetroAsync(request, odbcName);
            
            return Content(GenerateHtmlResults(results), "text/html");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Access retro calculation");
            return Content($@"<html>
                <head><meta charset='utf-8'></head>
                <body dir='rtl'>
                    <h1>שגיאה</h1>
                    <p>{ex.Message}</p>
                    <script>
                        setTimeout(() => {{if(window.opener){{window.close();}}}}, 5000);
                    </script>
                </body>
            </html>", "text/html");
        }
    }

    private string GenerateHtmlResults(DataTable results)
    {
        var html = new System.Text.StringBuilder();
        html.Append(@"<html>
            <head>
                <meta charset='utf-8'>
                <style>
                    body { font-family: Arial, sans-serif; direction: rtl; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th, td { border: 1px solid black; padding: 8px; text-align: right; }
                    th { background-color: #f2f2f2; }
                    .actions { position: fixed; bottom: 20px; left: 20px; }
                </style>
                <script>
                    function closeAndReturn() {
                        if(window.opener) {
                            window.close();
                        }
                    }
                </script>
            </head>
            <body>
                <h1>תוצאות חישוב רטרו</h1>");

        html.Append("<table>");

        // Add headers
        html.Append("<tr>");
        foreach (DataColumn col in results.Columns)
        {
            // התאמת שמות עמודות לעברית
            var headerName = col.ColumnName switch
            {
                "mnt_display" => "תקופה",
                "sugtsname" => "סוג חיוב",
                "paysum" => "סכום",
                "sumhan" => "הנחה",
                "dtgv" => "ת.גביה",
                "dtval" => "ת.ערך",
                "payer_name" => "משלם",
                _ => col.ColumnName
            };
            html.Append($"<th>{headerName}</th>");
        }
        html.Append("</tr>");

        // Add data rows
        foreach (DataRow row in results.Rows)
        {
            html.Append("<tr>");
            foreach (DataColumn col in results.Columns)
            {
                var value = row[col]?.ToString() ?? "";
                html.Append($"<td>{value}</td>");
            }
            html.Append("</tr>");
        }

        html.Append(@"</table>
            <div class='actions'>
                <button onclick='closeAndReturn()'>סגור</button>
            </div>
            </body></html>");

        return html.ToString();
    }
}