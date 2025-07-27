import { UserDto } from "./user";
import { RentalDto } from "./rent";

export class CartDto {
  id: number | null;

  user: UserDto;
  cartItems: CartItemDto[] | null;
}

export class CartItemDto {
  id: number;

  cart: CartDto;
  rental: RentalDto;
  quantity: number = 1;
}
