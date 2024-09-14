import City, { CityDocument } from "@/infrastructure/schemas/CitySchema";

class CityRepository {
  async getCitiesByStateId(stateId: number): Promise<CityDocument[]> {
    try {
      return await City.find({ "state.id_state": stateId });
    } catch (error) {
      console.error("Error retrieving cities:", error);
      return [];
    }
  }
}

export default CityRepository;
