import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import { ApiService } from "@/application/services/ApiService";

const apiService = new ApiService();
export class CalculatorService {
  async getStates(): Promise<SelectListViewModel[]> {
    try {
      const headers = apiService.getHeader("GET");
      const response = await fetch(`api/state`, {
        headers,
      });
      const data = await response.json();
      return data?.states || [];
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  }
}
