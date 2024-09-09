import City, { CityDocument } from "@/infrastructure/schemas/CitySchema";
import { MultiselectListViewModel } from "@/domain/models/MultiselectListViewModel";

export class CityService {
  private cities: MultiselectListViewModel[] = [];

  constructor(initialCities: MultiselectListViewModel[] = []) {
    this.cities = initialCities;
  }

  async getCitiesFromMongoDB(stateId: number) {
    try {
      return await City.find((c: CityDocument) => c.state.id_state === stateId);
    } catch (error) {
      console.error("Error retrieving cities:", error);
      return [];
    }
  }

  async getCityByStateId(stateId: number) {
    if (this.cities.some((state) => state.id === stateId)) return this.cities;

    const citiesFromMongoDB = await this.getCitiesFromMongoDB(stateId);

    this.cities.push({
      id: stateId,
      name: citiesFromMongoDB[0].state.name_state,
      list: citiesFromMongoDB.map((city) => ({
        id: city.id_city,
        name: city.name_city,
      })),
    });

    return this.cities;
  }
}
