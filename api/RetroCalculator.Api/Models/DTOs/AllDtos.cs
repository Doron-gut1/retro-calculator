namespace RetroCalculator.Api.Models.DTOs;

public class PropertyDto
{
    public string PropertyId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Size { get; set; }
    public string PayerId { get; set; } = string.Empty;
    public string PayerName { get; set; } = string.Empty;
}

public class PayerDto
{
    public int PayerId { get; set; }
    public double PayerNumber { get; set; }
    public string FullName { get; set; } = string.Empty;
}

public class SizeAndTariffDto
{
    public int Index { get; set; }
    public float? Size { get; set; }
    public int? TariffId { get; set; }
    public string? TariffDescription { get; set; }
}

public class RetroCalculationRequestDto
{
    public string PropertyId { get; set; } = string.Empty;
    public int JobNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ChargeTypeIds { get; set; } = new();
    public List<SizeAndTariffDto> SizesAndTariffs { get; set; } = new();
}

public class RetroApprovalDto
{
    public string PropertyId { get; set; } = string.Empty;
    public int JobNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsHistorical { get; set; }
    public bool IsDifferencesOnly { get; set; }
    public string? Notes { get; set; }
    public List<RetroCalculationResultDto> Results { get; set; } = new();
}

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