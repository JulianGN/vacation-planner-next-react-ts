import mongoose, { Schema, Document } from "mongoose";

// Define the StateDocument interface to represent a state
export interface StateDocument extends Document {
  id_state: number;
  name_state: string;
  uf: string;
}

// Define the State schema
const StateSchema: Schema = new Schema({
  id_state: { type: Number, required: true, unique: true }, // Manual ID
  name_state: { type: String, required: true }, // State name
  uf: { type: String, required: true }, // State abbreviation (UF)
});

// Export the State model
export default mongoose.model<StateDocument>("State", StateSchema);
