import CityRepository from "@/infrastructure/repositories/CityRepository";
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel";
import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import createHttpError from "http-errors";

const cityRepository = new CityRepository();

export class CityService {
  private cities: SelectListGroupByIdViewModel[] = [];

  constructor(initialCities: SelectListGroupByIdViewModel[] = []) {
    this.cities = initialCities;
  }

  async getCitiesByStateId(stateId: number): Promise<SelectListViewModel[]> {
    const cachedState = this.cities.find((state) => state.id === stateId);
    if (cachedState) return cachedState.list;

    const citiesFromDb = await cityRepository.getCitiesByStateId(stateId);

    if (!citiesFromDb?.length)
      throw new createHttpError.NotFound(
        `No cities found for stateId: ${stateId}`
      );

    const newState = {
      id: stateId,
      name: citiesFromDb[0].state.name_state,
      list: citiesFromDb.map((city) => ({
        id: city.id_city,
        name: city.name_city,
      })),
    };

    this.cities.push(newState);
    return newState.list;
  }
}
