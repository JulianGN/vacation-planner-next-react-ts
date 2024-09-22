import mongoose, { Schema, Document, Types } from "mongoose";
import { ObjectId } from "mongodb";

export interface HolidayDocument extends Document {
  _id?: ObjectId;
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  state: Types.ObjectId | null;
  city: Types.ObjectId | null;
}

export interface HolidayQuery {
  $expr: {
    $and: Array<any>;
  };
}

const HolidaySchema: Schema = new Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["national", "state", "city"], required: true },
  state: { type: Schema.Types.ObjectId, ref: "State", required: false },
  city: { type: Schema.Types.ObjectId, ref: "City", required: false },
});

export default mongoose.models.Holiday ||
  mongoose.model<HolidayDocument>("Holiday", HolidaySchema);
