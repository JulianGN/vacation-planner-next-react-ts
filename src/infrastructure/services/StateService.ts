import State from "@/infrastructure/schemas/StateSchema";
import { SelectListViewModel } from "@/domain/models/SelectListViewModel";

export class StateService {
  private states: SelectListViewModel[] = [];

  constructor(initialStates: SelectListViewModel[] = []) {
    this.states = this.states.length ? this.states : initialStates;
  }

  async getStatesFromMongoDB() {
    try {
      return await State.find();
    } catch (error) {
      console.error("Error retrieving states:", error);
      return [];
    }
  }

  async getStates() {
    const statesFromMongoDB = await this.getStatesFromMongoDB();
    this.states = this.states.length
      ? this.states
      : statesFromMongoDB.map((state) => ({
          id: state.id_state,
          name: state.name_state,
        }));
    return this.states;
  }
}
