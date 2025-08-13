import { type CartDto, type CartItemDto } from "@rent-to-craft/dtos";

export interface CartContextType {
  addItem: (item: Partial<CartItemDto>) => Promise<void>;
  cart: CartDto | null;
  clearCart: () => Promise<void>;
  getCart: () => Promise<void>;
  isLoading: boolean;
  removeItem: (item: CartItemDto) => Promise<void>;
  setCart: (cart: CartDto | null) => void;
  updateItem: (item: Partial<CartItemDto>) => Promise<void>;
}
