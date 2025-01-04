namespace RetroCalculator.Api.Models.DTOs;

public class RetroCalculationRequestDto
{
    public string PropertyId { get; set; }
    public int JobNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ChargeTypeIds { get; set; }
    public List<SizeAndTariffDto> SizesAndTariffs { get; set; }
}

public class RetroCalculationResultDto
{
    public int Period { get; set; }  // mnt
    public string PropertyId { get; set; }
    public int ChargeTypeId { get; set; }
    public string ChargeTypeName { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Total { get; set; }
    public DateTime? ValueDate { get; set; }
    public DateTime? CollectionDate { get; set; }
}