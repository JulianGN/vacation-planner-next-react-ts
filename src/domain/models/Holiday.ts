export interface Holiday {
  id: string;
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  state?: string;
  city?: string;
}
