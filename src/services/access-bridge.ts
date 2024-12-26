// Bridge to MS Access
export interface AccessBridge {
  // Core functions that map to Access functionality
  searchProperty(propertyId: string): Promise<any>;
  getPayerDetails(payerId: string): Promise<any>;
  calculateRetro(params: any): Promise<any>;
  
  // Direct mappings to Access functions
  execPrepareRetroData(hs: string, mspkod: number): Promise<void>;
  execMultiplyTempArnmforatRows(hs: string, sugtsList: string): Promise<void>;
  execCalcRetroProcessManager(moazaCode: number, userName: string, jobNum: number): Promise<void>;
  
  // Error handling
  addDbError(error: {
    user: string;
    errnum: string;
    errdesc: string;
    modulname: string;
    errline: number;
    jobnum: number;
  }): Promise<void>;
}