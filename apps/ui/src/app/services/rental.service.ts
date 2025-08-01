import { type RentalDto } from "@rent-to-craft/dtos";

import api from "./api.service";

type RentalServiceType = {
  getOne: (rentalId: string) => Promise<RentalDto | null>;
};
const RentalService: RentalServiceType = {
  getOne: async (rentalId: string) => {
    const response = await api.get(`/rental/${rentalId}`);
    return response.data;
  },
};
export default RentalService;
