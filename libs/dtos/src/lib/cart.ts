import { UserDto } from "./user";
import { RentalDto } from "./rent";

export class CartDto {
  id: number | null;

  user: UserDto;
  cartItems: CartItemDto[] | null;
}

export class CartItemDto {
  id: number;

  cart: Partial<CartDto>;
  rental: Partial<RentalDto>;
  quantity: number = 1;
}
