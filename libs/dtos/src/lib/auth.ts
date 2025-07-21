import { Expose } from "class-transformer";

export class SignupAuthDto {
  @Expose()
  email: string;
  password: string;
  @Expose()
  firstName?: string;
  @Expose()
  lastName?: string;
}

export class SigninAuthDto {
  @Expose()
  email: string;
  password: string;
}

export class ResetPasswordDto {
  password: string;
}

export class CreateTokenResetPasswordDto {
  @Expose()
  email: string;
}

export class PayloadDto {
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  id: number;
}
