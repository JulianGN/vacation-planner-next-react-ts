import { describe, it, expect } from "vitest";
import { useCalculatorVacation } from "@/application/hooks/useCalculatorVacation";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Holiday } from "@/domain/models/Holiday";

describe("useCalculatorVacation", () => {
  const { verifyIfDaysIsWorkDay, verifyIfDaysIsHoliday, getClosestWorkDay } =
    useCalculatorVacation();

  const workdays: WorkDay[] = [
    WorkDay.monday,
    WorkDay.tuesday,
    WorkDay.wednesday,
    WorkDay.thursday,
    WorkDay.friday,
  ];
  const holidays: Holiday[] = [
    {
      date: new Date("2024-10-12T03:00:00.000Z"),
      name: "Nossa Senhora Aparecida",
      type: "national",
    },
    {
      date: new Date("2024-11-02T03:00:00.000Z"),
      name: "Finados",
      type: "national",
    },
    {
      date: new Date("2024-11-15T03:00:00.000Z"),
      name: "Proclamação da República",
      type: "national",
    },
    {
      date: new Date("2024-11-20T03:00:00.000Z"),
      name: "Dia da consciência negra",
      type: "national",
    },
    {
      date: new Date("2024-11-20T03:00:00.000Z"),
      name: "Feriado municipal",
      type: "city",
    },
    {
      date: new Date("2024-12-25T03:00:00.000Z"),
      name: "Natal",
      type: "national",
    },
    {
      date: new Date("2025-01-01T03:00:00.000Z"),
      name: "Confraternização mundial",
      type: "national",
    },
    {
      date: new Date("2025-01-26T03:00:00.000Z"),
      name: "Feriado municipal",
      type: "city",
    },
    {
      date: new Date("2025-03-03T03:00:00.000Z"),
      name: "Carnaval",
      type: "national",
    },
    {
      date: new Date("2025-03-04T03:00:00.000Z"),
      name: "Carnaval",
      type: "national",
    },
    {
      date: new Date("2025-04-18T03:00:00.000Z"),
      name: "Paixão de Cristo",
      type: "national",
    },
    {
      date: new Date("2025-04-20T03:00:00.000Z"),
      name: "Páscoa",
      type: "national",
    },
    {
      date: new Date("2025-04-21T03:00:00.000Z"),
      name: "Tiradentes",
      type: "national",
    },
    {
      date: new Date("2025-05-01T03:00:00.000Z"),
      name: "Dia do trabalho",
      type: "national",
    },
    {
      date: new Date("2025-06-19T03:00:00.000Z"),
      name: "Corpus Christi",
      type: "national",
    },
    {
      date: new Date("2025-07-09T00:00:00.000Z"),
      name: "Revolução Constitucionalista de 1932",
      type: "state",
    },
    {
      date: new Date("2025-09-07T03:00:00.000Z"),
      name: "Independência do Brasil",
      type: "national",
    },
    {
      date: new Date("2025-09-07T03:00:00.000Z"),
      name: "Feriado municipal",
      type: "city",
    },
  ];
  const holidayDates = holidays.map((holiday) => holiday.date);

  describe("getClosestWorkDay", () => {
    it("should return the next workday after a Tiradentes", () => {
      const holidayDate = new Date("2025-04-21T03:00:00.000Z");
      const closestWorkDay = getClosestWorkDay(
        holidayDate,
        false,
        holidayDates,
        workdays,
        false
      );
      expect(closestWorkDay.getDay()).toBe(WorkDay.tuesday);
    });

    it("should return the previous workday before a Tiradentes", () => {
      const holidayDate = new Date("2025-04-21T03:00:00.000Z");
      const closestWorkDay = getClosestWorkDay(
        holidayDate,
        true,
        holidayDates,
        workdays,
        false
      );
      expect(closestWorkDay.getDay()).toBe(WorkDay.thursday);
    });

    it("should return the next workday after a weekend", () => {
      const holidayDate = new Date("2025-04-19T03:00:00.000Z"); // Saturday
      const closestWorkDay = getClosestWorkDay(
        holidayDate,
        false,
        holidayDates,
        workdays,
        false
      );
      expect(closestWorkDay.getDay()).toBe(WorkDay.tuesday);
    });

    it("should return the previous workday before a weekend", () => {
      const holidayDate = new Date("2025-04-19T03:00:00.000Z"); // Saturday
      const closestWorkDay = getClosestWorkDay(
        holidayDate,
        true,
        holidayDates,
        workdays,
        false
      );
      expect(closestWorkDay.getDay()).toBe(WorkDay.thursday);
    });
  });

  describe("getClosestWorkDay_acceptJumpBridge", () => {
    it("should return the next workday after Dia do Trabalho", () => {
      const holidayDate = new Date("2025-05-01T03:00:00.000Z");
      const closestWorkDay = getClosestWorkDay(
        holidayDate,
        false,
        holidayDates,
        workdays,
        true
      );
      expect(closestWorkDay.getDay()).toBe(WorkDay.monday);
    });

    it("should return the next workday after Corpus Christi", () => {
      const holidayDate = new Date("2025-06-19T03:00:00.000Z");
      const closestWorkDay = getClosestWorkDay(
        holidayDate,
        false,
        holidayDates,
        workdays,
        true
      );
      expect(closestWorkDay.getDay()).toBe(WorkDay.monday);
    });
  });

  describe("verifyIfDaysIsHoliday", () => {
    it("should return true for a holiday date", () => {
      const holidayDate = new Date("2025-04-21T03:00:00.000Z");
      const isHoliday = verifyIfDaysIsHoliday(holidayDate, holidayDates);
      expect(isHoliday).toBe(true);
    });

    it("should return false for a non-holiday date", () => {
      const nonHolidayDate = new Date("2025-04-22T03:00:00.000Z");
      const isHoliday = verifyIfDaysIsHoliday(nonHolidayDate, holidayDates);
      expect(isHoliday).toBe(false);
    });
  });

  describe("verifyIfDaysIsWorkDay", () => {
    it("should return true for a workday", () => {
      const workdayDate = new Date("2025-04-22T03:00:00.000Z"); // Tuesday
      const isWorkDay = verifyIfDaysIsWorkDay(workdayDate, workdays);
      expect(isWorkDay).toBe(true);
    });

    it("should return false for a non-workday", () => {
      const nonWorkdayDate = new Date("2025-04-19T03:00:00.000Z"); // Saturday
      const isWorkDay = verifyIfDaysIsWorkDay(nonWorkdayDate, workdays);
      expect(isWorkDay).toBe(false);
    });
  });
});
