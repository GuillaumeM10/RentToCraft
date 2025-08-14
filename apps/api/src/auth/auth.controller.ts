import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTokenResetPasswordDto,
  ResetPasswordDto,
  SigninAuthDto,
  SignupAuthDto,
  UserDto,
} from '@rent-to-craft/dtos';

import { User } from '../decorator/user.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/jwt-passport.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupAuthDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signup(signupAuthDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SigninAuthDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: { $ref: '#/components/schemas/UserDto' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signin(@Body() signinAuthDto: SigninAuthDto) {
    return this.authService.signin(signinAuthDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: CreateTokenResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(
    @Body() createTokenResetPasswordDto: CreateTokenResetPasswordDto,
  ) {
    return this.authService.forgotPassword(createTokenResetPasswordDto);
  }

  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiParam({ name: 'token', description: 'Reset password token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
  })
  @ApiResponse({ status: 400, description: 'Invalid token or password' })
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Headers('authorization') token: string, @User() user: UserDto) {
    return this.authService.logout(token, user.id);
  }
}
