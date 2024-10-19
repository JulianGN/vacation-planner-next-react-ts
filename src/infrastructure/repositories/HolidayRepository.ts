import Holiday, {
  HolidayDocument,
  HolidayQuery,
} from "@/infrastructure/schemas/HolidaySchema";
import {
  getEqByPropObjectId,
  geyEqByProp,
} from "@/infrastructure/helpers/queryHelper";
class StateRepository {
  async getAll(
    idDbState?: string,
    idDbCity?: string
  ): Promise<HolidayDocument[]> {
    try {
      const query: HolidayQuery = {
        $expr: { $and: [] },
      };

      if (!idDbState || !idDbCity) {
        query.$expr.$and.push(geyEqByProp("type", "national"));
      } else {
        query.$expr.$and.push({ $or: [] });
        const or = query.$expr.$and.at(-1).$or;
        or.push(geyEqByProp("type", "national"));
        if (idDbState) or.push(getEqByPropObjectId("state", idDbState));
        if (idDbCity) or.push(getEqByPropObjectId("city", idDbCity));
      }

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
