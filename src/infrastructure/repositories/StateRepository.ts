import { StateDocument } from "@/infrastructure/schemas/StateSchema";

class StateRepository {
  basePath = process.env.NEXT_PUBLIC_BASE_URL || "";

  async getAll(): Promise<StateDocument[]> {
    try {
      const response = await fetch(`${this.basePath}/json/states.json`);
      if (!response.ok)
        throw new Error(`Failed to fetch states: ${response.statusText}`);

      const states: StateDocument[] = await response.json();
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
}

export default StateRepository;
