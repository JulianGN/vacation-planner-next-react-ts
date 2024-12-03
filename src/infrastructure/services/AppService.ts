import connectDB from "@/infrastructure/db/db";
import mongoose from "mongoose";

export class AppService {
  private isInitialized: boolean = false;
  private isShuttingDown: boolean = false;

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
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    console.log("Shutdown signal received: closing database connection");
    await this.shutdown();
  };

  async shutdown() {
    if (this.isInitialized) {
      await mongoose.disconnect();
      this.isInitialized = false; // Reset the initialization flag
    }
  }
}
