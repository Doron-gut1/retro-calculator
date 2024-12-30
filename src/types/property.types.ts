export interface Property {
  id: string;
  address: string;
  type: number;
  sizes: PropertySize[];
}

export interface PropertySize {
  index: number;
  size: number;
  tariffCode: number;
  tariffName: string;
  price: number;
}

export interface Payer {
  id: number;
  name: string;
}

export interface PropertyDetails extends Property {
  payer: Payer;
}