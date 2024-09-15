import { HolidayPeriod, HolidayQuery } from "@/domain/models/Holiday";
import Holiday, {
  HolidayDocument,
} from "@/infrastructure/schemas/HolidaySchema";
import {
  getDateExprPeriod,
  getPeriodIgnoringYear,
} from "../helpers/dateHelpers";
import { getEqObjectId } from "../helpers/queryHelper";
class StateRepository {
  async getAllByPeriod(
    period: HolidayPeriod,
    idDbState?: string,
    idDbCity?: string
  ): Promise<HolidayDocument[]> {
    try {
      const dateFromDbYear = getPeriodIgnoringYear(period);
      const datePeriod = getDateExprPeriod(dateFromDbYear);
      const query: HolidayQuery = {
        $expr: { $and: datePeriod },
      };

      if (idDbState || idDbCity) query.$expr.$and.push({ $or: [] });
      const or = query.$expr.$and.at(-1).$or;
      if (idDbState) or.push(getEqObjectId("state", idDbState));
      if (idDbCity) or.push(getEqObjectId("city", idDbCity));

      return await Holiday.find(query);
    } catch (error) {
      console.error(
        `Error retrieving holidays for idState ${idDbState} and idCity ${idDbCity}:`,
        error
      );
      return [];
    }
  }
}

export default StateRepository;
