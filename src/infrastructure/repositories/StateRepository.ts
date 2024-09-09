import State, { StateDocument } from "@/infrastructure/schemas/StateSchema";

class StateRepository {
  async getAll(): Promise<StateDocument[]> {
    try {
      return await State.find();
    } catch (error) {
      console.error("Error retrieving states:", error);
      return [];
    }
  }

  async findById(id: string): Promise<StateDocument | null> {
    try {
      return await State.findOne({ id_state: id });
    } catch (error) {
      console.error(`Error retrieving state with id ${id}:`, error);
      return null;
    }
  }
}

export default StateRepository;
