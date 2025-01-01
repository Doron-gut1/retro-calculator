export interface Property {
  hskod: string;
  ktovet: string;
  mspkod: number;
  fullname: string;
  maintz: string;
}

export interface PropertySearchProps {
  onPropertySelect: (property: Property) => void;
}