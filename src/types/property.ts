export interface PropertySize {
  index: number;
  size: number;
  tariffCode: number;
  tariffName: string;
}

export interface PropertyDetails {
  hskod: string;
  mspkod: number;
  ktovet: string;
  sizes: PropertySize[];
}

export interface PayerDetails {
  mspkod: number;
  name: string;
  maintz: string;
}
