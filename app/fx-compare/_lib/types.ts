export interface FxRateState {
  rates: Record<string, number> | null;
  currencies: { code: string; name: string }[];
  timestamp: string | null;
  source: string | null;
  error: string | null;
  loading: boolean;
}
