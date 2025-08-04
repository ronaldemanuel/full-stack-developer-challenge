export namespace HashService {
  export const TOKEN = 'HashService';

  export interface Service {
    hash(value: string): Promise<string>;
    compare(value: string, hashedValue: string): Promise<boolean>;
  }
}
