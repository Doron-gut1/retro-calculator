namespace RetroCalculator.Api.Models.DTOs;

public class PropertyDto
{
    public string PropertyId { get; set; } = string.Empty;
    public int PayerId { get; set; }            // mspkod
    public double PayerNumber { get; set; }     // maintz
    public string PayerName { get; set; } = string.Empty;  // fullname

    // גדלים ותעריפים
    public double Size1 { get; set; }          // godel
    public int Tariff1 { get; set; }          // mas
    public double Size2 { get; set; }          // gdl2
    public int Tariff2 { get; set; }          // mas2
    public double Size3 { get; set; }          // gdl3
    public int Tariff3 { get; set; }          // mas3
    public double Size4 { get; set; }          // gdl4
    public int Tariff4 { get; set; }          // mas4
    public double Size5 { get; set; }          // gdl5
    public int Tariff5 { get; set; }          // mas5
    public double Size6 { get; set; }          // gdl6
    public int Tariff6 { get; set; }          // mas6
    public double Size7 { get; set; }          // gdl7
    public int Tariff7 { get; set; }          // mas7
    public double Size8 { get; set; }          // gdl8
    public int Tariff8 { get; set; }          // mas8

    // תאריכי תוקף
    public DateTime? ValidFrom { get; set; }    // valdate
    public DateTime? ValidTo { get; set; }      // valdatesof
}

public class RetroCalculationResultDto
{
    public string PropertyId { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;  // dbo.mntname(MNT)
    public int ChargeTypeId { get; set; }     // SUGTS
    public decimal PaymentAmount { get; set; } // PAYSUM
    public decimal DiscountAmount { get; set; } // SUMHAN
    public decimal Total { get; set; }          // PAYSUM - SUMHAN
    public DateTime? CollectionDate { get; set; } // DTGV
    public DateTime? ValueDate { get; set; }    // DTVAL
}

public class RetroCalculationRequestDto
{
    public string PropertyId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ChargeTypes { get; set; } = new();
    public int JobNumber { get; set; }        // JOBNUM
}