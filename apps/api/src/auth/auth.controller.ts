import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/user/dtos';

import { User } from '../decorator/user.decorator';
import { AuthService } from './auth.service';
import {
  CreateTokenResetPasswordDto,
  ResetPasswordDto,
  SigninAuthDto,
  SignupAuthDto,
} from './dtos';
import { AuthGuard } from './guard/jwt-passport.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signup(signupAuthDto);
  }

  @Post('signin')
  async signin(@Body() signinAuthDto: SigninAuthDto) {
    return this.authService.signin(signinAuthDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() createTokenResetPasswordDto: CreateTokenResetPasswordDto,
  ) {
    console.log(createTokenResetPasswordDto);

    return this.authService.forgotPassword(createTokenResetPasswordDto);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Headers('authorization') token: string, @User() user: UserDto) {
    return this.authService.logout(token, user.id);
  }
}
