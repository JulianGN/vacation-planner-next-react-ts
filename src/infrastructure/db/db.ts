import mongoose from "mongoose";
import { config } from "dotenv";
config({ path: ".env.local" });

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    console.log(uri);
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    const error = err as Error;
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
