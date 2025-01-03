namespace RetroCalculator.Api.Models;

public class RetroResultDto
{
    public string Period { get; set; } = string.Empty;
    public string ChargeType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
}