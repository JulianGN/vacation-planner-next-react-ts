import { ParamsResult } from "@/domain/models/ParamsResult";
import { NextResponse } from "next/server";

export class ApiService {
  getHeader(method: "GET" | "POST" | "PUT" | "DELETE"): Headers {
    const headers = new Headers();
    headers.append(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_BASE_URL || "*"
    );
    headers.append("Access-Control-Allow-Methods", method);
    return headers;
  }

  private verifyQuerParamItem = (
    searchParams: URLSearchParams,
    item: string
  ): NextResponse | null => {
    const param = searchParams.get(item);

    if (!param) {
      return NextResponse.json(
        { error: `${item} is required` },
        { status: 400 }
      );
    }

    return null;
  };

  getParamValues = (req: Request, params: string[]) => {
    const { searchParams } = new URL(req.url);
    const result: ParamsResult = {
      notification: null,
      values: [],
    };

    for (const param of params) {
      const notification = this.verifyQuerParamItem(searchParams, param);
      const value = searchParams.get(param);
      if (notification || !value) {
        result.notification = notification;
        break;
      } else result.values.push(value);
    }

    return result;
  };
}
