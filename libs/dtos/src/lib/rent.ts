import { FileDto } from "./file";
import { UserDto } from "./user";
import { OrderItemDto } from "./order";

export class RentalDto {
  id: number | null;

  name: string;
  slug: string;
  description: string | null;
  quantity: number = 1;
  price?: number;
  startAvailable?: Date;
  endAvailable?: Date;

  images: FileDto[] | File[];
  cats: RentalCatDto[] | null;
  user: UserDto;
  comments: RentalCommentDto[] | null;
}

export class CreateRentalDto {
  name: string;
  slug: string;
  description: string | null;
  quantity: number = 1;
  price?: number;
  startAvailable?: Date;
  endAvailable?: Date;

  images: FileDto[] | File[];
  cats: number[] | null;
  user: UserDto;
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

  rental: Partial<RentalDto>;
  author: UserDto;
}
