import mongoose, { Schema, Document } from "mongoose";

interface CityDocument extends Document {
  name: string;
  state: mongoose.Schema.Types.ObjectId; // Reference to State
}

const CitySchema: Schema = new Schema({
  name: { type: String, required: true },
  state: { type: Schema.Types.ObjectId, ref: "State", required: true }, // Reference to State
});

export default mongoose.model<CityDocument>("City", CitySchema);
