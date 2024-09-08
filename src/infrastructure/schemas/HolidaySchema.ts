import mongoose, { Schema, Document, Types } from "mongoose";

interface HolidayDocument extends Document {
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  state: Types.ObjectId | null; // Foreign key reference to State
  city: Types.ObjectId | null; // Foreign key reference to City
}

const HolidaySchema: Schema = new Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["national", "state", "city"], required: true },
  state: { type: Schema.Types.ObjectId, ref: "State", required: false }, // FK to State
  city: { type: Schema.Types.ObjectId, ref: "City", required: false }, // FK to City
});

export default mongoose.model<HolidayDocument>("Holiday", HolidaySchema);
