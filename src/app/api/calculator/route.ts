import { NextResponse } from "next/server";
// import { Holiday } from '@/domain/models/Calculator';
// import { HolidayService } from '@/domain/services/CalculatorService';

// const holidays = [
//   new Holiday(new Date('2023-12-25'), 'Christmas'),
//   new Holiday(new Date('2024-01-01'), 'New Year\'s Day'),
// ];

// const holidayService = new HolidayService(holidays);

export async function GET() {
  const data = { id: 1 };
  return NextResponse.json(data);
}
