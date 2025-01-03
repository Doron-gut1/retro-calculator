namespace RetroCalculator.Api.Models;

public class PropertyDto
{
    public string Id { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Size { get; set; }
    public string PayerId { get; set; } = string.Empty;
    public string PayerName { get; set; } = string.Empty;
}