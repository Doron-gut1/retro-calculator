namespace RetroCalculator.Api.Models;

public class Property
{
    public string PropertyId { get; set; } // hskod
    public int PayerId { get; set; } // mspkod
    
    // Sizes and Tariffs
    public float? Size1 { get; set; } // godel
    public int? Tariff1 { get; set; } // mas
    public float? Size2 { get; set; } // gdl2
    public int? Tariff2 { get; set; } // mas2
    public float? Size3 { get; set; } // gdl3
    public int? Tariff3 { get; set; } // mas3
    public float? Size4 { get; set; } // gdl4
    public int? Tariff4 { get; set; } // mas4
    public float? Size5 { get; set; } // gdl5
    public int? Tariff5 { get; set; } // mas5
    public float? Size6 { get; set; } // gdl6
    public int? Tariff6 { get; set; } // mas6
    public float? Size7 { get; set; } // gdl7
    public int? Tariff7 { get; set; } // mas7
    public float? Size8 { get; set; } // gdl8
    public int? Tariff8 { get; set; } // mas8
    
    public DateTime? ValidFrom { get; set; } // valdate
    public DateTime? ValidTo { get; set; } // valdatesof
}