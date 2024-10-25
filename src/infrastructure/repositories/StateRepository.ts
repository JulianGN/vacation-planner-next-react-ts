import State, { StateDocument } from "@/infrastructure/schemas/StateSchema";
import { ObjectId } from "mongodb";

class StateRepository {
  async getAll(): Promise<StateDocument[]> {
    try {
      return await State.find().sort({
        name_state: 1,
      });
    } catch (error) {
      console.error("Error retrieving states:", error);
      return [];
    }
  }

  async findById(
    id: string | number | ObjectId
  ): Promise<StateDocument | null> {
    const query =
      typeof id === "number"
        ? { id_state: id }
        : { _id: typeof id === "string" ? new ObjectId(id) : id };

    try {
      return await State.findOne(query);
    } catch (error) {
      console.error(`Error retrieving state with idState ${id}:`, error);
      return null;
    }
  }
}

export default StateRepository;
