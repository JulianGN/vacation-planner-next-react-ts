export interface Holiday {
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  optional?: boolean;
  id_state?: number;
  id_city?: number;
}
