import { Record } from '../../types';

class AccessService {
  private accessCommands = {
    openForm: async (formName: string, parameters?: Record) => {
      // Implementation will be added later when integrating with Access
      console.log('Opening form:', formName, parameters);
    },
    closeForm: async (formName: string) => {
      // Implementation will be added later when integrating with Access
      console.log('Closing form:', formName);
    }
  };

  async openForm(formName: string, parameters?: Record) {
    return this.accessCommands.openForm(formName, parameters);
  }

  async closeForm(formName: string) {
    return this.accessCommands.closeForm(formName);
  }
}

export const accessService = new AccessService();