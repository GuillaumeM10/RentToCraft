import { Expose } from 'class-transformer';
import { ValidtokenDto } from 'src/valid-token/dtos';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  password: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  token?: ValidtokenDto;
}

export class UserUpdateDto extends UserDto {
  override password: string = '';
}
