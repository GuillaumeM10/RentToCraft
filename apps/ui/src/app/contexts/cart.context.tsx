"use client";

import { type CartDto, type CartItemDto } from "@rent-to-craft/dtos";
import { AxiosError } from "axios";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { type CartContextType } from "../interfaces/cartContext.interface";
import CartService from "../services/cart.service";
import CartItemService from "../services/cart-item.service";
import { useAuth } from "./auth.context";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  readonly children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartDto | null>(null);

  const getCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const cartResponse = await CartService.getCart();
      setCart(cartResponse);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.status === 404) {
        const newCart = await CartService.createCart();
        setCart(newCart);
      }
    }

    setIsLoading(false);
  }, []);

  const addItem = useCallback(
    async (item: Partial<CartItemDto>) => {
      await CartItemService.createCartItem(item);
      await getCart();
    },
    [getCart],
  );

  const updateItem = useCallback(
    async (item: Partial<CartItemDto>) => {
      await CartItemService.updateCartItem(item);
      await getCart();
    },
    [getCart],
  );

  const removeItem = useCallback(
    async (item: CartItemDto) => {
      await CartItemService.deleteCartItem(item.id);
      await getCart();
    },
    [getCart],
  );

  const clearCart = useCallback(async () => {
    await CartItemService.deleteAllCartItems();
    await getCart();
  }, [getCart]);

  useEffect(() => {
    if (isAuthenticated) {
      void getCart();
    }
  }, [isAuthenticated, getCart]);

  const value = useMemo<CartContextType>(
    () => ({
      isLoading,
      cart,
      addItem,
      removeItem,
      clearCart,
      getCart,
      updateItem,
    }),
    [isLoading, cart, addItem, removeItem, clearCart, getCart, updateItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within an CartProvider");
  }
  return context;
}
