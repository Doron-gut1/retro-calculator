export interface Property {
  hskod: string;
  ktovet: string;
  mspkod: number;
  fullname: string;
  maintz: string;
  sughs: number;
  godel: number;
  gdl2?: number;
  gdl3?: number;
  gdl4?: number;
  gdl5?: number;
  gdl6?: number;
  gdl7?: number;
  gdl8?: number;
}

export interface PropertySearchProps {
  onPropertySelect: (property: Property) => void;
}

export interface PayerDetails {
  mspkod: number;
  fullname: string;
  maintz: string;
}