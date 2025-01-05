namespace RetroCalculator.Api.Models;

public class TempArnmforat
{
    public string Hs { get; set; } = string.Empty;          // קוד נכס
    public int Mspkod { get; set; }                        // קוד משלם
    public int Sugts { get; set; }                         // סוג חיוב
    public double Gdl1 { get; set; }                       // גודל 1
    public int Trf1 { get; set; }                          // תעריף 1
    public double Gdl2 { get; set; }                       // גודל 2
    public int Trf2 { get; set; }                          // תעריף 2
    public double Gdl3 { get; set; }                       // גודל 3
    public int Trf3 { get; set; }                          // תעריף 3
    public double Gdl4 { get; set; }                       // גודל 4
    public int Trf4 { get; set; }                          // תעריף 4
    public double Gdl5 { get; set; }                       // גודל 5
    public int Trf5 { get; set; }                          // תעריף 5
    public double Gdl6 { get; set; }                       // גודל 6
    public int Trf6 { get; set; }                          // תעריף 6
    public double Gdl7 { get; set; }                       // גודל 7
    public int Trf7 { get; set; }                          // תעריף 7
    public double Gdl8 { get; set; }                       // גודל 8
    public int Trf8 { get; set; }                          // תעריף 8
    public DateTime Hdtme { get; set; }                    // תאריך התחלה
    public DateTime Hdtad { get; set; }                    // תאריך סיום
    public int Jobnum { get; set; }                        // מספר תהליך
    public DateTime? Valdate { get; set; }                 // תאריך תוקף
    public DateTime? Valdatesof { get; set; }              // תאריך תוקף סופי
    public int Hkarn { get; set; }                         // הסדר
    public DateTime? Dtgv { get; set; }                    // תאריך גביה
    public DateTime? Dtval { get; set; }                   // תאריך ערך
}