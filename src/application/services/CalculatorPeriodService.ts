import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel";
import { ApiService } from "@/application/services/ApiService";

const apiService = new ApiService();

export class CalculatorPeriodService {
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

  async getCitiesByIdState(
    idState: number
  ): Promise<SelectListGroupByIdViewModel[]> {
    try {
      const headers = apiService.getHeader("GET");
      const response = await fetch(`api/city?idState=${idState}`, {
        headers,
      });
      const data = await response.json();
      return data?.cities || [];
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  }
}
