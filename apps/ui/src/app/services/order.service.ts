import { type CreateOrderDto, type OrderDto } from "@rent-to-craft/dtos";

import api from "./api.service";
type OrderServiceType = {
  getMyOrders: () => Promise<OrderDto[]>;
  getOrderById: (orderId: number) => Promise<OrderDto>;
  getOrders: () => Promise<OrderDto[]>;
  createOrder: (order: CreateOrderDto) => Promise<OrderDto>;
  updateOrder: (order: Partial<OrderDto>) => Promise<OrderDto>;
  deleteOrder: (orderId: number) => Promise<OrderDto>;
};
const OrderService: OrderServiceType = {
  getMyOrders: async () => {
    const response = await api.get(`/order/me`);
    return response.data;
  },
  getOrderById: async (orderId: number) => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get(`/order`);
    return response.data;
  },
  createOrder: async (order: CreateOrderDto) => {
    if (order.orderItems) {
      order.orderItems.forEach((item) => {
        if (item.rental) {
          item.rental.images = undefined;
          if (item.rental.user) {
            item.rental.user.profilePicture = null;
          }
        }
      });
    }

    if (order.user) {
      order.user.profilePicture = null;
    }

    const response = await api.post(`/order`, order);
    return response.data;
  },
  updateOrder: async (order: Partial<OrderDto>) => {
    const response = await api.put(`/order/${order.id}`, order);
    return response.data;
  },
  deleteOrder: async (orderId: number) => {
    const response = await api.delete(`/order/${orderId}`);
    return response.data;
  },
};
export default OrderService;
