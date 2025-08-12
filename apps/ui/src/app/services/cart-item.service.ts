import { type CartItemDto } from "@rent-to-craft/dtos";

import api from "./api.service";

type CartItemServiceType = {
  getCartItems: (cartId: number) => Promise<CartItemDto[]>;
  createCartItem: (cartItem: Partial<CartItemDto>) => Promise<CartItemDto>;
  updateCartItem: (cartItem: Partial<CartItemDto>) => Promise<CartItemDto>;
  deleteCartItem: (cartItemId: number) => Promise<void>;
  deleteAllCartItems: () => Promise<void>;
};
const CartitemService: CartItemServiceType = {
  getCartItems: async (cartId: number) => {
    const response = await api.get(`/cart-item/cart/${cartId}`);
    return response.data;
  },
  createCartItem: async (cartItem: Partial<CartItemDto>) => {
    if (cartItem.rental) {
      cartItem.rental.images = undefined;
    }

    if (cartItem.cart) {
      cartItem.cart = {
        id: cartItem.cart.id,
      };
    }

    const response = await api.post(`/cart-item`, cartItem);
    return response.data;
  },
  updateCartItem: async (cartItem: Partial<CartItemDto>) => {
    const response = await api.put(`/cart-item/${cartItem.id}`, cartItem);
    return response.data;
  },
  deleteCartItem: async (cartItemId: number) => {
    const response = await api.delete(`/cart-item/${cartItemId}`);
    return response.data;
  },
  deleteAllCartItems: async () => {
    const response = await api.delete(`/cart-item/all`);
    return response.data;
  },
};
export default CartitemService;
