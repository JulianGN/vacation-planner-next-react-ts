import { promises as fs } from "fs";
import path from "path";
import { CityDocument } from "@/infrastructure/schemas/CitySchema";
import StateRepository from "./StateRepository";

const stateRepository = new StateRepository();
class CityRepository {
  basePath = process.env.NEXT_PUBLIC_BASE_URL || "";

  async getCitiesByIdState(idState: number): Promise<CityDocument[]> {
    try {
      const state = await stateRepository.findById(idState);
      if (!state) return [];

      const response = await fetch(
        `${this.basePath}/json/cities/${state.uf?.toUpperCase()}.json`
      );
      if (!response.ok)
        throw new Error(`Failed to fetch cities: ${response.statusText}`);

      const cities: CityDocument[] = await response.json();
      const sortedCities = cities.sort((a, b) =>
        a.name_city.localeCompare(b.name_city)
      );

      return sortedCities.map((city) => ({
        ...city,
        state: {
          id_state: state.id_state,
          name_state: state.name_state,
          uf: state.uf,
        },
      }));
    } catch (error) {
      console.error("Error retrieving cities:", error);
      return [];
    }
  }

  async findById(id: number): Promise<CityDocument | null> {
    try {
      // TODO
      return {} as CityDocument;
      // const _id = typeof id === "string" ? new ObjectId(id) : id;
      // return await City.findOne({ _id });
    } catch (error) {
      console.error(`Error retrieving state with id ${id}:`, error);
      return null;
    }
  }
}

export default CityRepository;
