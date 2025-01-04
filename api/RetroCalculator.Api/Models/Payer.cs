namespace RetroCalculator.Api.Models;

public class Payer
{
    public int PayerId { get; set; } // mspkod
    public double? PayerNumber { get; set; } // maintz
    public string FullName { get; set; } // fullname
}