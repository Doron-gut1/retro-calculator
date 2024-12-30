declare global {
  interface Window {
    accessBridge: {
      openForm: (formName: string, parameters?: Record<string, any>) => Promise<void>;
      closeForm: (formName: string) => Promise<void>;
    };
  }
}

export function getAccessConnection() {
  if (!window.accessBridge) {
    throw new Error('Access bridge not initialized');
  }
  return window.accessBridge;
}