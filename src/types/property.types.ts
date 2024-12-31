export interface Property {
  hskod: string;
  ktovet: string;
  sughs: number;
  mspkod: number;
  sizes: PropertySize[];
  payer?: PayerInfo;
  validFrom?: Date;
  validTo?: Date;
  hkarn?: number;
  retnum?: number;
}

export interface PropertySize {
  index: number;
  size: number;
  mas: number;
  masName?: string;
  notInHan?: boolean;
}

export interface PayerInfo {
  mspkod: number;
  maintz: string;
  fullname: string;
  active?: boolean;
}

export interface PropertySearchResult {
  hskod: string;
  ktovet: string;
  mspkod: number;
  maintz?: string;
  fullname?: string;
}