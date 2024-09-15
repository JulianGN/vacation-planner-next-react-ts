import createHttpError from "http-errors";
import StateRepository from "@/infrastructure/repositories/StateRepository";
import CityRepository from "@/infrastructure/repositories/CityRepository";
import { HolidayDocument } from "../schemas/HolidaySchema";
import HolidayRepository from "../repositories/HolidayRepository";
import { HolidayPeriod } from "@/domain/models/Holiday";

const holidayRepository = new HolidayRepository();
const stateRepository = new StateRepository();
const cityRepository = new CityRepository();

export class HolidayService {
  async getHolidaysOrdenedByDate(
    period: HolidayPeriod,
    idState?: number,
    idCity?: string
  ): Promise<HolidayDocument[]> {
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

    const holidaysFromDb = await holidayRepository.getAllByPeriod(
      period,
      stateFromDb?._id.toString(),
      cityFromDb?._id.toString()
    );

    if (!holidaysFromDb?.length) {
      throw new createHttpError.NotFound(
        `No holidays found for idState: ${idState} and idCity: ${idCity}`
      );
    }

    return holidaysFromDb.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
