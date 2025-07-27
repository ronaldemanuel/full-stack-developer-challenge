export namespace DatabaseService {
  export const TOKEN = 'DatabaseService';
  export interface Service {
    migrate(): Promise<void>;
    cleanTables(): Promise<void>;
    teardown(): Promise<void>;
  }
}
