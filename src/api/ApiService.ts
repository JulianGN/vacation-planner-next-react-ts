export class ApiService {
  getHeader(method: "GET" | "POST" | "PUT" | "DELETE"): Headers {
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", process.env.API_URL || "*");
    headers.append("Access-Control-Allow-Methods", method);
    return headers;
  }
}
