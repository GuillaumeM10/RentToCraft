import { type CityDto } from "@rent-to-craft/dtos";

import api from "./api.service";

type CityServiceType = {
  getAll: () => Promise<CityDto[]>;
  getOne: (cityId: number | string) => Promise<{
    city: CityDto;
    rentals: number[];
  }>;
  search: (query: string) => Promise<CityDto[]>;
};

const CityService: CityServiceType = {
  getAll: async () => {
    const response = await api.get(`/city`);
    return response.data;
  },
  getOne: async (cityId: number | string) => {
    const response = await api.get(`/city/${cityId}`);
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/city/search/${query}`);
    return response.data;
  },
};
export default CityService;
