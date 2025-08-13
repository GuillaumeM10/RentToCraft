import { UserDto } from "./user";
import { RentalDto } from "./rent";

export class OrderDto {
  id: number | null;

  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  total: number = 0;
  status: OrderStatus;
  user: UserDto;
  orderItems: OrderItemDto[] | null;
}

export class CreateOrderDto {
  total?: number;
  user?: UserDto;
  orderItems?: Partial<OrderItemDto>[];
}

export class OrderItemDto {
  id: number;
  quantity: number = 1;

  order: Partial<OrderDto>;
  rental: Partial<RentalDto>;
}

export enum OrderStatus {
  pending = "En attente",
  confirmed = "Confirmé",
  shipped = "Expédié",
  delivered = "Livré",
  cancelled = "Annulé",
}
