namespace RetroCalculator.Api.Models.DTOs;

public class PropertyDto
{
    public string PropertyId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Size { get; set; }
    public string PayerId { get; set; } = string.Empty;
    public string PayerName { get; set; } = string.Empty;
}