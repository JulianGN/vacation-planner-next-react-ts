import { NextResponse } from "next/server";
import { AppService } from "@/infrastructure/services/AppService";
import createHttpError from "http-errors";
import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";

const appService = new AppService();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CalculatorPeriodDto;
    console.log(body);
    if (!body) throw new createHttpError.BadRequest("body is required");

    await appService.initialize();

    const response = 200;

    return NextResponse.json({ response });
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
