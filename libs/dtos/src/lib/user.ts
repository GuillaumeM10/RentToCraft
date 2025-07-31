import { Exclude } from "class-transformer";
import { ValidtokenDto } from "./valid-token";
import { PostCommentDto, PostDto } from "./pots";
import { FileDto } from "./file";
import { RentalCommentDto, RentalDto } from "./rent";
import { CityDto } from "./city";
import { CartDto } from "./cart";
import { OrderDto } from "./order";

export class UserDto {
  id: number | null;
  email: string;
  @Exclude()
  password: string;

  firstName: string | null;
  lastName: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  contactEmail: string | null;

  role: UserRole;
  isPublic: boolean;

  posts: PostDto[] | null;
  postComments: PostCommentDto[] | null;
  banner: FileDto | File | null;
  profilePicture: FileDto | File | null;
  city: CityDto | null;
  rentals: RentalDto[] | null;
  rentalComments: RentalCommentDto[] | null;
  cart: CartDto | null;
  orders: OrderDto[] | null;

  @Exclude()
  token?: ValidtokenDto;
}

export enum UserRole {
  user = "user",
  seller = "seller",
  administrator = "administrator",
  redactor = "redactor",
}

export class UserUpdateDto extends UserDto {
  @Exclude()
  override password: string = "";
}
