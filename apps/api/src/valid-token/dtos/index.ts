import { Expose } from 'class-transformer';
import { UserDto } from 'src/user/dtos';

export class CreateValidTokenDto {
  token: string;
  user: UserDto;
}

export class ValidtokenDto extends CreateValidTokenDto {
  id: number;
}

export class TokenDto {
  @Expose()
  accessToken: string;
}
