namespace RetroCalculator.Api.Models.DTOs;

public class RetroCalculationRequestDto
{
    public string PropertyId { get; set; } = string.Empty;
    public int JobNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ChargeTypeIds { get; set; } = new();
    public List<SizeAndTariffDto> SizesAndTariffs { get; set; } = new();
}