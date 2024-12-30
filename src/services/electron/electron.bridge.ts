declare global {
  interface Window {
    electron: {
      openExternal: (url: string) => Promise<void>;
      showSaveDialog: (options: any) => Promise<string>;
      closeWindow: () => void;
    };
  }
}

export function getElectronAPI() {
  if (!window.electron) {
    throw new Error('Electron API not available');
  }
  return window.electron;
}