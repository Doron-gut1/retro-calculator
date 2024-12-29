import { OdbcConnection } from './odbcConnection';
import { RetroCalculationService } from './RetroCalculationService';
import { useRetroStore } from '../store/retroStore';

export class RetroCalculator {
  private odbcConnection: OdbcConnection;
  private calculationService: RetroCalculationService;

  constructor(connectionOptions: {
    server: string;
    database: string;
    username?: string;
    password?: string;
  }) {
    this.odbcConnection = new OdbcConnection(connectionOptions);
    this.calculationService = new RetroCalculationService(this.odbcConnection);
  }

  async loadProperty(propertyCode: string) {
    const store = useRetroStore.getState();
    
    try {
      store.setIsLoading('property', true);
      store.setPropertyCode(propertyCode);

      await this.odbcConnection.connect();
      const propertyData = await this.calculationService.getPropertyData(propertyCode);
      
      store.setPropertyData(propertyData);
      
    } catch (error) {
      store.setError('property', error instanceof Error ? error.message : 'Failed to load property');
      store.setPropertyData(null);
    } finally {
      store.setIsLoading('property', false);
      await this.odbcConnection.disconnect();
    }
  }

  async calculate() {
    const store = useRetroStore.getState();
    const { 
      propertyCode, 
      startDate, 
      endDate, 
      selectedChargeTypes 
    } = store;

    if (!propertyCode || !startDate || !endDate || selectedChargeTypes.length === 0) {
      store.setError('calculation', 'Missing required calculation parameters');
      return;
    }

    try {
      store.setIsLoading('calculation', true);

      const results = await this.calculationService.calculateRetro(
        propertyCode,
        startDate,
        endDate,
        selectedChargeTypes
      );

      store.setCalculationResults(results);
      
    } catch (error) {
      store.setError('calculation', error instanceof Error ? error.message : 'Calculation failed');
      store.setCalculationResults(null);
    } finally {
      store.setIsLoading('calculation', false);
    }
  }

  async approve() {
    const store = useRetroStore.getState();
    const { propertyCode, calculationResults } = store;

    if (!calculationResults) {
      store.setError('calculation', 'No calculation results to approve');
      return;
    }

    try {
      store.setIsLoading('calculation', true);

      await this.odbcConnection.connect();
      await this.odbcConnection.transaction(async (connection) => {
        // 1. Move temp rows to final tables
        await connection.query(`
          INSERT INTO TASH (MNT, MSPKOD, TASHHS, SUGTS, SUM, HANSUM, HESDERSUM, HESBER, DTVAL, DTGV)
          SELECT MNT, MSPKOD, HS, SUGTS, PAYSUM, SUMHAN, SUMHK, HESBER, DTVAL, DTGV
          FROM TEMPARNMFORAT
          WHERE HS = ? AND JOBNUM = ?
        `, [propertyCode, calculationResults.jobnum]);

        // 2. Update ARN records if needed
        await connection.query(`
          INSERT INTO ARN (MNT, MSPKOD, HS, PAYSUM, SUMHAN, SUMHK)
          SELECT MNT, MSPKOD, HS, PAYSUM, SUMHAN, SUMHK
          FROM TEMPARNMFORAT
          WHERE HS = ? AND JOBNUM = ? AND SUGTS = 1010
        `, [propertyCode, calculationResults.jobnum]);

        // 3. Clean up temp tables
        await connection.query(`
          DELETE FROM TEMPARNMFORAT 
          WHERE HS = ? AND JOBNUM = ?
        `, [propertyCode, calculationResults.jobnum]);
      });

      // Reset store after successful approval
      store.reset();
      
    } catch (error) {
      store.setError('calculation', error instanceof Error ? error.message : 'Approval failed');
    } finally {
      store.setIsLoading('calculation', false);
      await this.odbcConnection.disconnect();
    }
  }

  async cancel() {
    const store = useRetroStore.getState();
    const { propertyCode, calculationResults } = store;

    if (!calculationResults) {
      // If there are no results, just reset the store
      store.reset();
      return;
    }

    try {
      store.setIsLoading('calculation', true);

      await this.odbcConnection.connect();
      
      // Clean up temp calculations
      await this.odbcConnection.execute(`
        DELETE FROM TEMPARNMFORAT 
        WHERE HS = ? AND JOBNUM = ?
      `, [propertyCode, calculationResults.jobnum]);

      // Reset store
      store.reset();
      
    } catch (error) {
      store.setError('calculation', error instanceof Error ? error.message : 'Failed to cancel calculation');
    } finally {
      store.setIsLoading('calculation', false);
      await this.odbcConnection.disconnect();
    }
  }
}