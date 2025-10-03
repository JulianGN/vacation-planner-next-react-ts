"use server";

import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { CalculatorVacationService } from "@/application/services/CalculatorVacationService";
import { HolidayService } from "@/infrastructure/services/HolidayService";
import { AppService } from "@/infrastructure/services/AppService";
import createHttpError from "http-errors";

const appService = new AppService();
const holidayService = new HolidayService();
const calculatorVacationService = new CalculatorVacationService();

/**
 * Server Action to fetch states.
 */
export async function fetchStates() {
  try {
    await appService.initialize(); 
    const states = await holidayService.getStates(); 
    return states;
  } catch (error) {
    console.error("Server Action error fetching states:", error);
    return { error: "Falha ao buscar estados." };
  }
}

/**
 * Server Action to fetch cities by state ID.
 */
export async function fetchCitiesByState(idState: number) {
  try {
    await appService.initialize(); 
    
    const cities = await holidayService.getCitiesByState(idState); 
    return cities;
  } catch (error) {
    console.error("Server Action error fetching cities:", error);
    return { error: "Falha ao buscar cidades." };
  }
}

/**
 * Server Action to get vacation period options.
 */
export async function getVacationOptions(payload: CalculatorPeriodDto) {
  try {
    
    if (!payload) {
      throw new createHttpError.BadRequest("Payload é obrigatório");
    }
    await appService.initialize();
    const periodOptions = await calculatorVacationService.getVacationPeriodOptions(payload);
    return { periodOptions };
  } catch (error) {
    console.error("Server Action error getting period options:", error);
    if (createHttpError.isHttpError(error)) {
      return { error: error.message, status: error.statusCode };
    }
    
    return { error: "Falha ao calcular opções de período." };
  }
}

