import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import { CityService } from "@/infrastructure/services/CityService";
import { ApiService } from "@/api/ApiService";

const appService = new AppService();
const apiService = new ApiService();
const cityService = new CityService();

export async function GET(req: Request) {
  try {
    const paramValues = apiService.getParamValues(req, ["idState"]);
    if (paramValues.notification) return paramValues.notification;

    await appService.initialize();
    const [idState] = paramValues.values;

    const cities = await cityService.getCitiesByIdState(Number(idState));
    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Error in GET CITIES route:", error);
    return NextResponse.error();
  }
}
