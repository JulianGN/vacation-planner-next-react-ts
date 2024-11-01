import createHttpError from "http-errors";
import StateRepository from "@/infrastructure/repositories/StateRepository";
import CityRepository from "@/infrastructure/repositories/CityRepository";
import HolidayRepository from "@/infrastructure/repositories/HolidayRepository";
import { HolidayVariableService } from "@/infrastructure/services/HolidayVariableService";
import { Holiday } from "@/domain/models/Holiday";
import { HolidayDocument } from "../schemas/HolidaySchema";
import { Period } from "@/domain/models/CalculatorVacation";

const holidayRepository = new HolidayRepository();
const stateRepository = new StateRepository();
const cityRepository = new CityRepository();

const holidayVariableService = new HolidayVariableService();

export class HolidayService {
  updateHolidayPeriod(holidays: HolidayDocument[], period: Period) {
    const startYear = period.start.getFullYear();
    const endYear = period.end.getFullYear();

    holidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      date.setFullYear(startYear);
      if (date.getTime() < period.start.getTime()) date.setFullYear(endYear);

      holiday.date = date;
    });
  }

  async getHolidaysOrdenedByDate(
    period: Period,
    idState?: number,
    idCity?: string
  ): Promise<Holiday[]> {
    const stateFromDb = idState
      ? await stateRepository.findById(idState)
      : null;
    const cityFromDb = idCity ? await cityRepository.findById(idCity) : null;

    if (idState && !stateFromDb) {
      throw new createHttpError.NotFound(
        `State not found for idState: ${idState}`
      );
    }

    if (idCity && !cityFromDb) {
      throw new createHttpError.NotFound(
        `City not found for idCity: ${idCity}`
      );
    }

    const holidaysFromDb = await holidayRepository.getAll(
      stateFromDb?._id.toString(),
      cityFromDb?._id.toString()
    );

    if (!holidaysFromDb?.length) {
      throw new createHttpError.NotFound(
        `No holidays found for idState: ${idState} and idCity: ${idCity}`
      );
    }

    this.updateHolidayPeriod(holidaysFromDb, period);

    const variableHolidays =
      holidayVariableService.getVariablesHolidaysByPeriod(period);

    const holidays = [...holidaysFromDb, ...variableHolidays].reduce(
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
