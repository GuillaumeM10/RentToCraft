import { Exclude } from "class-transformer";
import { UserRole } from "./user";

export class SignupAuthDto {
  email: string;
  @Exclude()
  password: string;
  firstName?: string;
  lastName?: string;
}

export class SigninAuthDto {
  email: string;
  @Exclude()
  password: string;
}

export class ResetPasswordDto {
  @Exclude()
  password: string;
}

export class CreateTokenResetPasswordDto {
  email: string;
}

export class PayloadDto {
  email: string;
  firstName: string;
  lastName: string;
  id: number;
  role: UserRole;
}
