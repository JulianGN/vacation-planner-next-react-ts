import { create } from "zustand";
import { produce } from "immer";
import { UiState } from "@/domain/models/UiState";

const useUiStore = create<UiState>((set) => {
  return {
    loading: false,
    loadingMessage: "",
    setLoading: (loading: boolean, loadingMessage: string = "Carregando") =>
      set(
        produce((state) => {
          state.loading = loading;
          state.loadingMessage = loadingMessage;
        })
      ),
  };
});

export default useUiStore;
