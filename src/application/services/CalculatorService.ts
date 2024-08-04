import { State } from "@/domain/models/State";
import statesJson from "@/infrastructure/json/estados-cidades.json";

export class CalculatorService {
  private states: State[] = [];

  constructor(initialStates: State[] = statesJson.estados) {
    this.states = initialStates;
  }

  getStates() {
    return this.states;
  }
}
