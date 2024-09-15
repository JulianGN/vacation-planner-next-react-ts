import CityRepository from "@/infrastructure/repositories/CityRepository";
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel";
import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import createHttpError from "http-errors";
import { CityDocument } from "../schemas/CitySchema";
import { ObjectId } from "mongodb";

const cityRepository = new CityRepository();

export class CityService {
  private cities: SelectListGroupByIdViewModel[] = [];

  constructor(initialCities: SelectListGroupByIdViewModel[] = []) {
    this.cities = initialCities;
  }

  async getCitiesByIdState(idState: number): Promise<SelectListViewModel[]> {
    const cachedState = this.cities.find((state) => state.id === idState);
    if (cachedState) return cachedState.list;

    const citiesFromDb = await cityRepository.getCitiesByIdState(idState);

    if (!citiesFromDb?.length)
      throw new createHttpError[404](`No cities found for idState: ${idState}`);

    const newState = {
      id: idState,
      name: citiesFromDb[0].state.name_state,
      list: citiesFromDb.map((city) => ({
        id: String(city._id),
        name: city.name_city,
      })),
    };

    this.cities.push(newState);
    return newState.list;
  }

  async getCityById(id: string): Promise<CityDocument> {
    const cityFromDb = await cityRepository.findById(id);

    if (!cityFromDb)
      throw new createHttpError[404](`No state found for id: ${id}`);

    return cityFromDb;
  }
}
