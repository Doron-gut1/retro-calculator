export interface Tariff {
  id: string;
  code: string;
  name: string;
  amount: number;
}

export interface Property {
  id: string;
  code: string;
  address: string;
  payerId: string;
  payerName: string;
  sizes: {
    id: string;
    size: number;
    tariff: Tariff;
  }[];
}