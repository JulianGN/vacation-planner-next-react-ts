import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import StateRepository from "@/infrastructure/repositories/StateRepository";

const stateRepository = new StateRepository();
export class StateService {
  async getStates(): Promise<SelectListViewModel[]> {
    {
      const states = await stateRepository.getAll();
      return (
        states?.map((state) => ({
          id: state.id_state,
          name: state.name_state,
        })) || []
      );
    }
  }
}
