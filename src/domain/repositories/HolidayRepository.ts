import { Holiday } from "@/domain/models/Holiday";

export interface HolidayRepository {
  findAll(): Promise<Holiday[]>;
  findById(id: string): Promise<Holiday | null>;
  create(holiday: Holiday): Promise<Holiday>;
  update(id: string, holiday: Holiday): Promise<Holiday | null>;
  delete(id: string): Promise<void>;
}
