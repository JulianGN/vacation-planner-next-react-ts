import { promises as fs } from "fs";
import path from "path";
import { CityDocument } from "@/infrastructure/schemas/CitySchema";
import StateRepository from "./StateRepository";

const stateRepository = new StateRepository();
class CityRepository {
  async getCitiesByIdState(idState: number): Promise<CityDocument[]> {
    try {
      const state = await stateRepository.findById(idState);
      if (!state) return [];

      const filePath = path.join(
        process.cwd(),
        "public",
        "json",
        "cities",
        `${state.uf?.toUpperCase()}.json`
      );

      const fileContents = await fs.readFile(filePath, "utf-8");
      const cities: CityDocument[] = JSON.parse(fileContents);
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
