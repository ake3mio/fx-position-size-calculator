export interface Account {
  balance: number;
  risk: number;
  stoploss: number;
  baseCurrency: string;
  accountSize: AccountSize;
}

export enum AccountSize {
  Standard = 100000,
  Mini = 10000,
  Micro = 1000,
}
