import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import { CityService } from "@/infrastructure/services/CityService";

const appService = new AppService();
const cityService = new CityService();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId");

    if (!stateId) {
      return NextResponse.json(
        { error: "stateId is required" },
        { status: 400 }
      );
    }

    await appService.initialize();

    const cities = await cityService.getCitiesByStateId(Number(stateId));

    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Error in GET CITIES route:", error);
    return NextResponse.error();
  }
}
