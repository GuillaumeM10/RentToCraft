import { UserDto } from './user';

export class CreateValidTokenDto {
  token: string;
  user: UserDto;
}

export class ValidtokenDto extends CreateValidTokenDto {
  id: number;
}

export class TokenDto {
  accessToken: string;
}
