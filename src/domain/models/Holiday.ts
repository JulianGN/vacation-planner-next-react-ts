export interface Holiday {
  id: number;
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  id_state?: number;
  id_city?: number;
}
