import { create } from "zustand";
import { produce } from "immer";
import { UiState } from "@/domain/models/UiState";

const useUiStore = create<UiState>((set) => {
  return {
    loading: false,
    setLoading: (loading) =>
      set(
        produce((state) => {
          state.loading = loading;
        })
      ),
  };
});

export default useUiStore;
