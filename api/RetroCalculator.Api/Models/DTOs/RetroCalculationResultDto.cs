namespace RetroCalculator.Api.Models.DTOs;

public class RetroCalculationResultDto
{
    public int Period { get; set; }
    public string PropertyId { get; set; } = string.Empty;
    public int ChargeTypeId { get; set; }
    public string ChargeTypeName { get; set; } = string.Empty;
    public decimal PaymentAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Total { get; set; }
    public DateTime? ValueDate { get; set; }
    public DateTime? CollectionDate { get; set; }
}