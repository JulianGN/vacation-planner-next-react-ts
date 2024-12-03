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
}
