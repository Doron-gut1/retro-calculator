namespace RetroCalculator.Api.Models.DTOs;

public class RetroCalculationRequestDto
{
    public string PropertyId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ChargeTypes { get; set; } = new();
    public List<SizeAndTariffDto> SizesAndTariffs { get; set; } = new();
}

public class SizeAndTariffDto
{
    public int Index { get; set; }
    public double Size { get; set; }
    public int TariffCode { get; set; }
}