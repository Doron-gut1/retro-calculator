import { RetroCalculationData } from '../../types/calculation.types';

export class RetroCalculator {
  calculate(data: RetroCalculationData) {
    // Implementation will be added
    console.log('Calculating retro for:', data);
    return {
      success: true,
      results: []
    };
  }
}

export const retroCalculator = new RetroCalculator();