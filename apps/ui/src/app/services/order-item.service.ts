import { type OrderItemDto } from "@rent-to-craft/dtos";

import api from "./api.service";

type OrderItemServiceType = {
  getOrderItems: (orderId: number) => Promise<OrderItemDto[]>;
  getOrderItemById: (orderItemId: number) => Promise<OrderItemDto>;
  updateOrderItem: (orderItem: Partial<OrderItemDto>) => Promise<OrderItemDto>;
  deleteOrderItem: (orderItemId: number) => Promise<void>;
};
const OrderItemService: OrderItemServiceType = {
  getOrderItems: async (orderId: number) => {
    const response = await api.get(`/order-item/order/${orderId}`);
    return response.data;
  },
  getOrderItemById: async (orderItemId: number) => {
    const response = await api.get(`/order-item/${orderItemId}`);
    return response.data;
  },
  updateOrderItem: async (orderItem: Partial<OrderItemDto>) => {
    const response = await api.put(`/order-item/${orderItem.id}`, orderItem);
    return response.data;
  },
  deleteOrderItem: async (orderItemId: number) => {
    const response = await api.delete(`/order-item/${orderItemId}`);
    return response.data;
  },
};
export default OrderItemService;
