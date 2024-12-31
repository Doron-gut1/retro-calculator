export interface OdbcConfig {
  connectionString: string;
  database: string;
  username?: string;
  password?: string;
}

export interface PropertyData {
  hskod: string;
  mspkod: number;
  sugts: number;
  sizes: PropertySize[];
  valdate?: Date;
  valdatesof?: Date;
}

export interface PropertySize {
  index: number;
  size: number;
  tariffCode: number;
  tariffName: string;
}

export interface PayerData {
  mspkod: number;
  fullname: string;
  maintz: string;
}
