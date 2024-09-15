import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { StateDocument } from "./StateSchema"; // Import for TypeScript typing

export interface CityDocument extends Document {
  _id: ObjectId;
  id_city: number;
  name_city: string;
  state: StateDocument; // Embedding the entire State object
}

const CitySchema: Schema = new Schema({
  id_city: { type: Number, required: true, unique: true }, // Manual ID for city
  name_city: { type: String, required: true },
  state: {
    type: new Schema({
      id_state: { type: Number, required: true }, // State ID
      name_state: { type: String, required: true }, // State name
      uf: { type: String, required: true }, // State abbreviation
    }),
    required: true, // Entire State object is required
  },
});

export default mongoose.models.City ||
  mongoose.model<CityDocument>("City", CitySchema);
