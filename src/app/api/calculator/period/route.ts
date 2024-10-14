import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import createHttpError from "http-errors";
import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { CalculatorVacationService } from "@/application/services/CalculatorVacationService";

const appService = new AppService();
const calculatorVacationService = new CalculatorVacationService();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CalculatorPeriodDto;
    if (!body) throw new createHttpError.BadRequest("body is required");

    await appService.initialize();
    const periodOptions =
      await calculatorVacationService.getVacationPeriodOptions(body);

    return NextResponse.json({ periodOptions });
  } catch (error) {
    if (createHttpError.isHttpError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("Error in POST PERIODS route:", error);
    return NextResponse.error();
  }
}
