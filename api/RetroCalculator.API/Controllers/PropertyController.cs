using Microsoft.AspNetCore.Mvc;

namespace RetroCalculator.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly ILogger<PropertyController> _logger;

        public PropertyController(ILogger<PropertyController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProperty(string id)
        {
            try
            {
                // TODO: Implement property retrieval
                return Ok(new { Id = id, Message = "Property details will be implemented" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving property");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}