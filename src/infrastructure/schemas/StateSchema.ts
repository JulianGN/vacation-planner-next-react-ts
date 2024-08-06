import mongoose, { Schema, Document } from "mongoose";

interface StateDocument extends Document {
  name: string;
}

const StateSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<StateDocument>("State", StateSchema);
