import { SelectListViewModel } from "./SelectListViewModel";

export interface SelectListGroupByIdViewModel {
  id: number | string;
  name: string;
  list: SelectListViewModel[];
}
