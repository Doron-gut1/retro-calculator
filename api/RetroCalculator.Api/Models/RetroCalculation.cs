namespace RetroCalculator.Api.Models;

public class RetroCalculation
{
    public int Id { get; set; } // moneln
    public int? Period { get; set; } // mnt
    public string PropertyId { get; set; } // hs
    public int PayerId { get; set; } // mspkod
    public int ChargeTypeId { get; set; } // sugts
    
    // Sizes and Tariffs
    public float? Size1 { get; set; } // gdl1
    public int? Tariff1 { get; set; } // trf1
    public float? Size2 { get; set; } // gdl2
    public int? Tariff2 { get; set; } // trf2
    public float? Size3 { get; set; } // gdl3
    public int? Tariff3 { get; set; } // trf3
    public float? Size4 { get; set; } // gdl4
    public int? Tariff4 { get; set; } // trf4
    public float? Size5 { get; set; } // gdl5
    public int? Tariff5 { get; set; } // trf5
    public float? Size6 { get; set; } // gdl6
    public int? Tariff6 { get; set; } // trf6
    public float? Size7 { get; set; } // gdl7
    public int? Tariff7 { get; set; } // trf7
    public float? Size8 { get; set; } // gdl8
    public int? Tariff8 { get; set; } // trf8
    
    // Amounts
    public decimal? PaymentAmount { get; set; } // paysum
    public decimal? DiscountAmount { get; set; } // sumhan
    public decimal? IndexAmount { get; set; } // sumhaz
    public decimal? InterestAmount { get; set; } // sumrbt
    
    // Process Info
    public int? JobNumber { get; set; } // jobnum
    public int? ArrangementType { get; set; } // hkarn
    public int? ArrangementCode { get; set; } // arnhesderkod
    public string Description { get; set; } // hesber
    public bool? IsNewCalculation { get; set; }
    
    // Dates
    public DateTime CalculationStartDate { get; set; } // hdtme
    public DateTime CalculationEndDate { get; set; } // hdtad
    public DateTime? ValueDate { get; set; } // dtval
    public DateTime? CollectionDate { get; set; } // dtgv
    public DateTime? ValidFrom { get; set; } // valdate
    public DateTime? ValidTo { get; set; } // valdatesof
}