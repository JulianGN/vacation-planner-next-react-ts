import connectDB from "@/infrastructure/db/db";
import mongoose from "mongoose";

export class AppService {
  private isInitialized: boolean = false;

  async initialize() {
    if (!this.isInitialized) {
      await connectDB();
      this.isInitialized = true;

      // Register shutdown handlers
      process.on("SIGINT", this.handleShutdown);
      process.on("SIGTERM", this.handleShutdown);
    }
  }

  private handleShutdown = async () => {
    console.log("Shutdown signal received: closing database connection");
    await this.shutdown();
    // Allow process to exit naturally
  };

  async shutdown() {
    if (this.isInitialized) {
      await mongoose.disconnect();
      this.isInitialized = false; // Reset the initialization flag
    }
  }
}
