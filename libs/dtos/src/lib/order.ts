import { UserDto } from "./user";
import { RentalDto } from "./rent";

export class OrderDto {
  id: number | null;
  total: number = 0;

  user: UserDto;
  orderItems: OrderItemDto[] | null;
}

export class OrderItemDto {
  id: number;
  quantity: number = 1;
  isValidated: boolean;

  order: OrderDto;
  rental: RentalDto;
}
