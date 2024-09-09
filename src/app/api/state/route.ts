import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import { StateService } from "@/infrastructure/services/StateService"; // Import StateService

const appService = new AppService();
const stateService = new StateService(); // Create an instance of StateService

export async function GET() {
  try {
    await appService.initialize();
    const states = await stateService.getStates(); // Call getStates method
    return NextResponse.json({ states }); // Return the states in the response
  } catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.error();
  }
}
