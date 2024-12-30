import { RetroCalculator } from './retro.calculator';
import { CalculationResult, CalculationParams } from '../../types/calculation.types';

export class CalculationService {
  private calculator: RetroCalculator;

  constructor() {
    this.calculator = new RetroCalculator();
  }

  async calculateRetro(params: CalculationParams): Promise<CalculationResult[]> {
    try {
      return await this.calculator.calculate(params);
    } catch (error) {
      console.error('Error in retro calculation:', error);
      throw error;
    }
  }
}