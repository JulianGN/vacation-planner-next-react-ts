import { SelectListViewModel } from "./SelectListViewModel";

export interface MultiselectListViewModel {
  id: number | string;
  name: string;
  list: SelectListViewModel[];
}
