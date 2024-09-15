import createHttpError from "http-errors";
import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import StateRepository from "@/infrastructure/repositories/StateRepository";
import { StateDocument } from "../schemas/StateSchema";

const stateRepository = new StateRepository();
export class StateService {
  private stateList: SelectListViewModel[] = [];

  constructor(initialStates: SelectListViewModel[] = []) {
    this.stateList = initialStates;
  }

  async getStates(): Promise<SelectListViewModel[]> {
    {
      const stateList = await stateRepository.getAll();

      this.stateList =
        stateList?.map((state) => ({
          id: state.id_state,
          name: state.name_state,
        })) || [];

      return this.stateList;
    }
  }

  async getStateByStateId(idState: number): Promise<StateDocument> {
    const stateFromDb = await stateRepository.findById(idState);

    if (!stateFromDb)
      throw new createHttpError[404](`No state found for idState: ${idState}`);

    return stateFromDb;
  }
}
