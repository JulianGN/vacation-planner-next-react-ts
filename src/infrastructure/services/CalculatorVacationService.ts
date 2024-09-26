import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Holiday, HolidayPeriod } from "@/domain/models/Holiday";
import { HolidayService } from "@/infrastructure/services/HolidayService";

const holidayService = new HolidayService();
export class CalculatorVacationService {
  filterHolidaysInsideWorkdays(
    holidays: Holiday[],
    workdays: WorkDay[],
    notWorkdays: WorkDay[]
  ): Holiday[] {
    if (!notWorkdays.length) return holidays;

    return holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      const weekDay = holidayDate.getDay();
      return workdays.includes(weekDay as WorkDay);
    });
  }

  filterPotentialBridgesHolidays(
    holidays: Holiday[],
    notWorkdays: WorkDay[]
  ): Holiday[] {
    if (!notWorkdays.length) return holidays;
    const potentialBridges = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      const dayOfWeek = holidayDate.getDay();
      const hasBridge = notWorkdays.some((notWorkday) => {
        const distanceToNonWorkday = Math.abs(dayOfWeek - notWorkday);
        return distanceToNonWorkday <= 2;
      });

      return hasBridge;
    });

    return potentialBridges;
  }

  async getVacationPeriodOptions(calculatorPeriodDto: CalculatorPeriodDto) {
    const { period, idState, idCity, workDays } = calculatorPeriodDto;

    const datePeriod = {
      start: new Date(period.start),
      end: new Date(period.end),
    } as HolidayPeriod;
    const numberIdState = !isNaN(Number(idState)) ? Number(idState) : undefined;

    const holidays = await holidayService.getHolidaysOrdenedByDate(
      datePeriod,
      numberIdState,
      idCity
    );

    const allWorkDays = Object.values(WorkDay).filter(
      (day) => typeof day === "number"
    );

    const notWorkdays = allWorkDays.filter(
      (day) => !workDays.includes(day)
    ) as WorkDay[];

    const holidaysInsideWorkdays = this.filterHolidaysInsideWorkdays(
      holidays,
      workDays,
      notWorkdays
    );

    const potentialBridges = this.filterPotentialBridgesHolidays(
      holidaysInsideWorkdays,
      notWorkdays
    );

    return { holidays, holidaysInsideWorkdays, potentialBridges };
  }
}
