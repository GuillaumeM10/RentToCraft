import { FileDto } from "./file";
import { UserDto } from "./user";
import { OrderItemDto } from "./order";

export class RentalDto {
  id: number | null;

  name: string;
  slug: string;
  description: string | null;
  quantity: number = 1;

  images: FileDto[];
  cats: RentalCatDto[] | null;
  user: UserDto;
  orderItems: OrderItemDto[] | null;
  comments: RentalCommentDto[] | null;
}

export class RentalCatDto {
  id: number | null;
  name: string;
  description: string | null;
  slug: string;

  rentals: RentalDto[] | null;
}

export class RentalCommentDto {
  id: number | null;
  content: string;

  rental: RentalDto;
  author: UserDto;
  replyTo: RentalCommentDto | null;
}
