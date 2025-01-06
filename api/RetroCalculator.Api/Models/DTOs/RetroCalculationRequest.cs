namespace RetroCalculator.Api.Models.DTOs;

public class RetroCalculationRequest
{
    public required string PropertyId { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
    public required IEnumerable<int> ChargeTypes { get; set; }
    public required IEnumerable<SizeAndTariff> SizesAndTariffs { get; set; }
    public int Hkarn { get; set; } = 0; // הסדר ברירת מחדל - ללא הסדר
}

public class SizeAndTariff
{
    public required int Index { get; set; }
    public required double Size { get; set; }
    public required int TariffCode { get; set; }
}