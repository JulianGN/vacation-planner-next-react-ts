import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import { StateService } from "@/infrastructure/services/StateService";

const appService = new AppService();
const stateService = new StateService();

export async function GET() {
  try {
    await appService.initialize();
    const states = await stateService.getStates();
    return NextResponse.json({ states });
  } catch (error) {
    console.error("Error in GET STATES route:", error);
    return NextResponse.error();
  }
}
