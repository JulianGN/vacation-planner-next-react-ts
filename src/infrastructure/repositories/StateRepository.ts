import { promises as fs } from "fs";
import path from "path";
import { StateDocument } from "@/infrastructure/schemas/StateSchema";

class StateRepository {
  async getAll(): Promise<StateDocument[]> {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "json",
        "states.json"
      );
      const fileContents = await fs.readFile(filePath, "utf-8");
      const states: StateDocument[] = JSON.parse(fileContents);

      return states.sort((a, b) => a.name_state.localeCompare(b.name_state));
    } catch (error) {
      console.error("Error retrieving states:", error);
      return [];
    }
  }

  async findById(id: number): Promise<StateDocument | null> {
    try {
      return await this.getAll().then((states) => {
        const state = states.find((state) => state.id_state === id);
        return state || null;
      });
    } catch (error) {
      console.error(`Error retrieving state with idState ${id}:`, error);
      return null;
    }
  }

  async getUfByIdState(idState: number): Promise<string | null> {
    try {
      const state = await this.findById(idState);
      return state?.uf || null;
    } catch (error) {
      console.error(`Error retrieving uf for idState ${idState}:`, error);
      return null;
    }
  }
}

export default StateRepository;
