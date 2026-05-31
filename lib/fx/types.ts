export interface FxCurrency {
  code: string;
  name: string;
}

export interface FxRateState {
  rates: Record<string, number> | null;
  currencies: FxCurrency[];
  timestamp: string | null;
  source: string | null;
  error: string | null;
  loading: boolean;
}
