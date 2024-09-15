import City, { CityDocument } from "@/infrastructure/schemas/CitySchema";
import { ObjectId } from "mongodb";

class CityRepository {
  async getCitiesByIdState(idState: number): Promise<CityDocument[]> {
    try {
      return await City.find({ "state.id_state": idState });
    } catch (error) {
      console.error("Error retrieving cities:", error);
      return [];
    }
  }

  async findById(id: ObjectId | string): Promise<CityDocument | null> {
    try {
      const _id = typeof id === "string" ? new ObjectId(id) : id;
      return await City.findOne({ _id });
    } catch (error) {
      console.error(`Error retrieving state with id ${id}:`, error);
      return null;
    }
  }
}

export default CityRepository;
