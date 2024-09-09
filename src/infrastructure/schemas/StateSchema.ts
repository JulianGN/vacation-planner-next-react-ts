import mongoose, { Schema, Document } from "mongoose";

export interface StateDocument extends Document {
  id_state: number;
  name_state: string;
  uf: string;
}

const StateSchema: Schema = new Schema({
  id_state: { type: Number, required: true, unique: true },
  name_state: { type: String, required: true },
  uf: { type: String, required: true },
});

export default mongoose.models.State ||
  mongoose.model<StateDocument>("State", StateSchema);
