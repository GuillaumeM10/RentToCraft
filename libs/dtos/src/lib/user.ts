import { Expose } from "class-transformer";
import { ValidtokenDto } from "./valid-token";

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  password: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  token?: ValidtokenDto;
}

export class UserUpdateDto extends UserDto {
  @Expose()
  override password: string = "";
}
