import mongoose, { Schema, Document } from "mongoose";

interface HolidayDocument extends Document {
  date: Date;
  name: string;
  type: "national" | "state" | "city";
  state?: mongoose.Schema.Types.ObjectId;
  city?: mongoose.Schema.Types.ObjectId;
}

const HolidaySchema: Schema = new Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["national", "state", "city"], required: true },
  state: { type: Schema.Types.ObjectId, ref: "State" },
  city: { type: Schema.Types.ObjectId, ref: "City" },
});

export default mongoose.model<HolidayDocument>("Holiday", HolidaySchema);
