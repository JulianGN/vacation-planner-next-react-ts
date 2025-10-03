import createHttpError from "http-errors";
import StateRepository from "@/infrastructure/repositories/StateRepository";
import CityRepository from "@/infrastructure/repositories/CityRepository";
import HolidayRepository from "@/infrastructure/repositories/HolidayRepository";
import { HolidayVariableService } from "@/infrastructure/services/HolidayVariableService";
import { Holiday } from "@/domain/models/Holiday";
import { HolidayDocument } from "../schemas/HolidaySchema";
import { Period } from "@/domain/models/CalculatorVacation";
import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel";

// Instantiate repositories
const stateRepository = new StateRepository();
const cityRepository = new CityRepository();
const holidayRepository = new HolidayRepository();

// Instantiate other services
const holidayVariableService = new HolidayVariableService();

export class HolidayService {

  /**
   * Fetches all states, formatted for dropdown selection.
   * @returns {Promise<SelectListViewModel[]>} A promise resolving to a list of states.
   */
  async getStates(): Promise<SelectListViewModel[]> {
    try {
      const statesFromDb = await stateRepository.getAll();
      return statesFromDb.map(state => ({
        id: state.id_state,
        name: state.name_state
      }));
    } catch (error) {
      console.error("Error fetching states in HolidayService:", error);
      throw new createHttpError.InternalServerError("Failed to fetch states");
    }
  }

  /**
   * Fetches cities for a given state ID, formatted for grouped dropdown selection.
   * Returns an array containing a single group for the specified state.
   * @param {number} idState - The ID of the state.
   * @returns {Promise<SelectListGroupByIdViewModel[]>} A promise resolving to an array with one city group.
   */
  async getCitiesByState(idState: number): Promise<SelectListGroupByIdViewModel[]> {
    try {
      if (isNaN(idState)) {
        throw new createHttpError.BadRequest("Invalid state ID provided.");
      }

      // Fetch state details to get the group name
      const stateDetails = await stateRepository.findById(idState);
      if (!stateDetails) {
        throw new createHttpError.NotFound(`State not found for idState: ${idState}`);
      }

      // Fetch cities for the state
      const citiesFromDb = await cityRepository.getCitiesByIdState(idState);

      // Map cities to SelectListViewModel
      const cityList: SelectListViewModel[] = citiesFromDb.map(city => ({
        id: city.id_city,
        name: city.name_city
      }));

      // Create the single group structure
      const cityGroup: SelectListGroupByIdViewModel = {
        id: stateDetails.id_state,
        name: stateDetails.name_state,
        list: cityList
      };

      // Return an array containing the single group
      return [cityGroup];

    } catch (error) {
      console.error(`Error fetching cities for state ${idState} in HolidayService:`, error);
      if (createHttpError.isHttpError(error)) throw error;
      throw new createHttpError.InternalServerError("Failed to fetch cities");
    }
  }

  /**
   * Updates the year of fixed holidays to match the provided period.
   * @param {HolidayDocument[]} holidays - List of holiday documents.
   * @param {Period} period - The start and end dates of the period.
   */
  updateHolidayPeriod(holidays: HolidayDocument[], period: Period) {
    const startYear = period.start.getFullYear();
    const endYear = period.end.getFullYear();

    holidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      date.setFullYear(startYear);
      if (date.getTime() < period.start.getTime()) {
        date.setFullYear(endYear);
      }
      holiday.date = date;
    });
  }

  /**
   * Fetches and combines fixed and variable holidays within a given period and location.
   * @param {Period} period - The start and end dates.
   * @param {number} [idState] - Optional state ID.
   * @param {string} [idCity] - Optional city ID.
   * @returns {Promise<Holiday[]>} A promise resolving to a sorted list of holidays.
   */
  async getHolidaysOrdenedByDate(
    period: Period,
    idState?: number,
    idCity?: string
  ): Promise<Holiday[]> {
    const stateFromDb = idState ? await stateRepository.findById(idState) : null;
    const cityFromDb = idCity ? await cityRepository.findById(Number(idCity)) : null; // Assuming findById exists and takes number

    if (idState && !stateFromDb) {
      throw new createHttpError.NotFound(`State not found for idState: ${idState}`);
    }
    if (idCity && !cityFromDb) {
      throw new createHttpError.NotFound(`City not found for idCity: ${idCity}`);
    }

    const stateId = stateFromDb?.id_state?.toString();
    const cityId = cityFromDb?.id_city?.toString();

    const holidaysFromDb = await holidayRepository.getAll(stateId, cityId);

    if (holidaysFromDb?.length) {
        this.updateHolidayPeriod(holidaysFromDb, period);
    }

    const variableHolidays = holidayVariableService.getVariablesHolidaysByPeriod(period);
    const combinedHolidays = [...(holidaysFromDb || []), ...variableHolidays];

    const holidays = combinedHolidays.reduce(
      (acc, holiday) => {
        const date = new Date(holiday.date);
        if (date >= period.start && date <= period.end) {
          acc.push({
            date: date,
            name: holiday.name,
            type: holiday.type,
          });
        }
        return acc;
      },
      [] as Holiday[]
    );

    return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

