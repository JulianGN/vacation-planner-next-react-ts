export interface Holiday {
  id: number;
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  id_state?: number;
  id_city?: number;
}

export interface HolidayPeriod {
  start: Date;
  end: Date;
}

export interface HolidayQuery {
  $expr: {
    $and: Array<any>;
  };
}
