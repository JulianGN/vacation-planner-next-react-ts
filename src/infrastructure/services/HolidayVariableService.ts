import { Holiday, Period } from "@/domain/models/Holiday";

export class HolidayVariableService {
  calculateEasterDate(year: number): Date[] {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    const easterDate = new Date(year, month - 1, day);
    const goodFridayDate = new Date(easterDate);
    goodFridayDate.setDate(easterDate.getDate() - 2);

    return [goodFridayDate, easterDate];
  }
  calculateCarnivalDate(easterDate: Date): Date[] {
    const carnivalTuesdayDate = new Date(easterDate);
    carnivalTuesdayDate.setDate(easterDate.getDate() - 47);
    const carnivalMondayDate = new Date(carnivalTuesdayDate);
    carnivalMondayDate.setDate(carnivalTuesdayDate.getDate() - 1);

    return [carnivalMondayDate, carnivalTuesdayDate];
  }
  calculateCorpusChristiDate(easterDate: Date): Date {
    const corpusChristiDate = new Date(easterDate);
    corpusChristiDate.setDate(easterDate.getDate() + 60);

    return corpusChristiDate;
  }
  calculateVariablesHolidays(year: number): Date[] {
    const easterDate = this.calculateEasterDate(year);
    const carnivalTuesdayDate = this.calculateCarnivalDate(easterDate[1]);
    const corpusChristiDate = this.calculateCorpusChristiDate(easterDate[1]);

    return [...carnivalTuesdayDate, ...easterDate, corpusChristiDate];
  }
  getVariablesHolidaysByPeriod(period: Period): Holiday[] {
    const holidays = [] as Holiday[];

    const years = new Set([
      period.start.getFullYear(),
      period.end.getFullYear(),
    ]);
    years.forEach((year) => {
      const [
        carnivalMondayDate,
        carnivalTuesdayDate,
        goodFridayDate,
        easterDate,
        corpusChristiDate,
      ] = this.calculateVariablesHolidays(year);

      [
        { holidayDate: carnivalMondayDate, holidayName: "Carnaval" },
        { holidayDate: carnivalTuesdayDate, holidayName: "Carnaval" },
        { holidayDate: goodFridayDate, holidayName: "Paixão de Cristo" },
        { holidayDate: easterDate, holidayName: "Páscoa" },
        { holidayDate: corpusChristiDate, holidayName: "Corpus Christi" },
      ].forEach((holiday) => {
        holidays.push({
          date: holiday.holidayDate,
          name: holiday.holidayName,
          type: "national",
        });
      });
    });

    return holidays.filter(
      (holiday) => holiday.date >= period.start && holiday.date <= period.end
    );
  }
}
