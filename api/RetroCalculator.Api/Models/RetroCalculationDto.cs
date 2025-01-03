namespace RetroCalculator.Api.Models;

public class RetroCalculationDto
{
    public string PropertyId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<string> ChargeTypes { get; set; } = new();
    public List<SizeAndTariff> SizesAndTariffs { get; set; } = new();
}

public class SizeAndTariff
{
    public int Id { get; set; }
    public decimal Size { get; set; }
    public string TariffCode { get; set; } = string.Empty;
    public string TariffName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}