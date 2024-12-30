import { getAccessConnection } from './access.bridge';

export class AccessService {
  private connection;

  constructor() {
    this.connection = getAccessConnection();
  }

  async openForm(formName: string, parameters?: Record<string, any>): Promise<void> {
    try {
      await this.connection.execute(`DoCmd.OpenForm "${formName}"`);
      if (parameters) {
        for (const [key, value] of Object.entries(parameters)) {
          await this.connection.execute(`Forms!${formName}!${key} = ${value}`);
        }
      }
    } catch (error) {
      console.error('Error opening Access form:', error);
      throw error;
    }
  }

  async closeForm(formName: string): Promise<void> {
    try {
      await this.connection.execute(`DoCmd.Close acForm, "${formName}"`);
    } catch (error) {
      console.error('Error closing Access form:', error);
      throw error;
    }
  }
}