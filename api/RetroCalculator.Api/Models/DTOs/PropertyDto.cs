namespace RetroCalculator.Api.Models.DTOs;

public class PropertyDto
{
    public string PropertyId { get; set; }
    public PayerDto Payer { get; set; }
    public List<SizeAndTariffDto> SizesAndTariffs { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
}

public class PayerDto
{
    public int PayerId { get; set; }
    public double PayerNumber { get; set; }
    public string FullName { get; set; }
}

public class SizeAndTariffDto
{
    public int Index { get; set; }  // 1-8
    public float? Size { get; set; }
    public int? TariffId { get; set; }
    public string TariffDescription { get; set; }
}