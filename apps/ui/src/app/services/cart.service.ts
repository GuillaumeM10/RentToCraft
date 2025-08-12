import { type CartDto } from "@rent-to-craft/dtos";

import api from "./api.service";
type CartServiceType = {
  getCart: () => Promise<CartDto>;
  createCart: () => Promise<CartDto>;
  updateCart: (cart: CartDto) => Promise<CartDto>;
};
const CartService: CartServiceType = {
  getCart: async () => {
    const response = await api.get(`/cart/me`);
    return response.data;
  },
  createCart: async () => {
    const response = await api.post(`/cart`);
    return response.data;
  },
  updateCart: async (cart: CartDto) => {
    const response = await api.put(`/cart/${cart.id}`, cart);
    return response.data;
  },
};
export default CartService;
