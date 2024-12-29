// src/types/property.ts
export interface PropertyDetails {
    hs: string;
    mspkod: number;
    ktovet?: string;
    sizes?: any[];
    tariffs?: any[];
  }
  
  export interface PropertySearchProps {
    onPropertyFound: (property: PropertyDetails) => void;
  }