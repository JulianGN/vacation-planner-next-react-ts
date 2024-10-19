export interface Period {
  start: Date;
  end: Date;
}
export interface PeriodOption {
  period: Period;
  daysUsed: number;
  daysOff: number;
}

export interface PotentialPeriodsBeginEndings {
  begin: Set<string>;
  end: Set<string>;
}
