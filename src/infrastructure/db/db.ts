import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB Connected");
  } catch (err) {
    const error = err as Error;
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
