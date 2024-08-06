import { HolidayRepository } from "@/domain/repositories/HolidayRepository";
import HolidayModel from "@/infrastructure/schemas/HolidaySchema";
import { Holiday } from "@/domain/models/Holiday";

class MongooseHolidayRepository implements HolidayRepository {
  findAll(): Promise<Holiday[]> {
    // return HolidayModel.find().exec();
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Holiday | null> {
    // return HolidayModel.findById(id).exec();
    throw new Error("Method not implemented.");
  }
  create(holiday: Holiday): Promise<Holiday> {
    // const createdHoliday = new HolidayModel(holiday);
    // return createdHoliday.save();
    throw new Error("Method not implemented.");
  }
  update(id: string, holiday: Holiday): Promise<Holiday | null> {
    // return HolidayModel.findByIdAndUpdate(id, holiday, { new: true }).exec();
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    // await HolidayModel.findByIdAndDelete(id).exec();
    throw new Error("Method not implemented.");
  }
}

const repository = new MongooseHolidayRepository();
export default repository;
