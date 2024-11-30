// Document schema for json data of cities
export interface CityDocument {
  id_city: number;
  name_city: string;
  state: {
    id_state: number;
    name_state: string;
    uf: string;
  };
}
