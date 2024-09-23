import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import { HolidayService } from "@/infrastructure/services/HolidayService";
import createHttpError from "http-errors";
import { HolidayParamsDTO } from "@/application/dtos/HolidayParamsDto";

const appService = new AppService();
const holidayService = new HolidayService();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const holidayParamsDTO = new HolidayParamsDTO(searchParams);

    const { period, numberIdState, idCity } = holidayParamsDTO;

    if (!period) throw new createHttpError.BadRequest("period is required");

    await appService.initialize();
    const holidays = await holidayService.getHolidaysOrdenedByDate(
      period,
      numberIdState,
      idCity
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
