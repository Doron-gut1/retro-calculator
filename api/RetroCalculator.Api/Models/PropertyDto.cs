namespace RetroCalculator.Api.Models
{
    public class PropertyDto
    {
        public string PropertyId { get; set; }
        public int PayerId { get; set; }
        public string PayerNumber { get; set; }
        public string PayerName { get; set; }
        public decimal Size1 { get; set; }
        public int Tariff1 { get; set; }
        public string Tariff1Name { get; set; }
        public decimal Size2 { get; set; }
        public int Tariff2 { get; set; }
        public string Tariff2Name { get; set; }
        public decimal Size3 { get; set; }
        public int Tariff3 { get; set; }
        public string Tariff3Name { get; set; }
        public decimal Size4 { get; set; }
        public int Tariff4 { get; set; }
        public string Tariff4Name { get; set; }
        public decimal Size5 { get; set; }
        public int Tariff5 { get; set; }
        public string Tariff5Name { get; set; }
        public decimal Size6 { get; set; }
        public int Tariff6 { get; set; }
        public string Tariff6Name { get; set; }
        public decimal Size7 { get; set; }
        public int Tariff7 { get; set; }
        public string Tariff7Name { get; set; }
        public decimal Size8 { get; set; }
        public int Tariff8 { get; set; }
        public string Tariff8Name { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }
}