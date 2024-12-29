export interface PropertyDetails {
  hskod: string;
  mspkod: number;
  ktovet: string;
  maintz?: string;
  sizes: PropertySize[];
}

export interface PropertySize {
  index: number;
  size: number;
  tariffCode: number;
  tariffName: string;
}

export interface PayerDetails {
  mspkod: number;
  name: string;
  maintz: string;
}
