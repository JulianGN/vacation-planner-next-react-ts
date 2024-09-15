import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import { HolidayService } from "@/infrastructure/services/HolidayService";
import createHttpError from "http-errors";

const appService = new AppService();
const holidayService = new HolidayService();

export async function GET(request: Request) {
  try {
    await appService.initialize();
    const holidays = await holidayService.getHolidaysOrdenedByDate(
      {
        start: new Date(),
        end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
      35,
      "66de2024360c7351bafb697a"
    );
    return NextResponse.json({ holidays });
  } catch (error) {
    if (createHttpError.isHttpError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("Error in GET STATES route:", error);
    return NextResponse.error();
  }
}
