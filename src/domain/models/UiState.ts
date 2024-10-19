export interface UiState {
  loading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, loadingMessage?: string) => void;
}
