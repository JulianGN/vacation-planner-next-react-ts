import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel";
import { ApiService } from "@/api/ApiService";
import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { CalculatorVacationResponseViewModel } from "@/domain/models/CalculatorVacationResponseViewModel";

const apiService = new ApiService();

export class ApiCalculatorPeriodService {
  async getStates(): Promise<SelectListViewModel[]> {
    try {
      const headers = apiService.getHeader("GET");
      const response = await fetch(`api/calculator/state`, {
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
      const response = await fetch(`api/calculator/city?idState=${idState}`, {
        headers,
      });
      const data = await response.json();
      return data?.cities || [];
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  }

  async getPeriodOptions(
    calculatorPeriodDto: CalculatorPeriodDto
  ): Promise<CalculatorVacationResponseViewModel | null> {
    try {
      const headers = apiService.getHeader("POST");
      const response = await fetch(`api/calculator/period`, {
        headers,
        method: "POST",
        body: JSON.stringify(calculatorPeriodDto),
      });
      const data = await response.json();
      return data?.periodOptions || null;
    } catch (error) {
      console.error("Error fetching periods:", error);
      return null;
    }
  }
}
