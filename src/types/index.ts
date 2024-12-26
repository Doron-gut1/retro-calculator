export interface Property {
  hs: string;             // קוד נכס
  mspkod: number;         // קוד משלם
  ktovet: string;         // כתובת
  maintz: string;         // שם משלם
  sizes: {
    gdl1: number;
    gdl2: number;
    gdl3: number;
    gdl4: number;
    gdl5: number;
    gdl6: number;
    gdl7: number;
    gdl8: number;
  };
  tariffs: {
    trf1: number;
    trf2: number;
    trf3: number;
    trf4: number;
    trf5: number;
    trf6: number;
    trf7: number;
    trf8: number;
  };
}

export interface RetroCalculation {
  hs: string;
  mspkod: number;
  dtStart: string;
  dtEnd: string;
  sugts: number[];
  sizes: Property['sizes'];
  tariffs: Property['tariffs'];
  jobnum: number;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}