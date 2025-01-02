/// <reference types="vite/client" />

declare module '@/components/ui/*' {
  const component: any;
  export default component;
  export const Alert: any;
  export const AlertDescription: any;
  export const AlertTitle: any;
  // Add other component exports as needed
}

interface Window {
  fs: {
    readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>;
  };
}