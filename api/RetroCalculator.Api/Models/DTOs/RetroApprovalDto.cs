namespace RetroCalculator.Api.Models.DTOs;

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