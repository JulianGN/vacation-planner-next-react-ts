import { NextResponse } from "next/server";

export interface ParamsResult {
  notification: NextResponse | null;
  values: string[];
}
