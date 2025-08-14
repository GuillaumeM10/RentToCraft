import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTokenResetPasswordDto } from '@rent-to-craft/dtos';

import { TokenResetPasswordService } from './token-reset-password.service';

@ApiTags('Token Reset Password')
@Controller('token-reset-password')
export class TokenResetPasswordController {
  constructor(
    private readonly tokenResetPasswordService: TokenResetPasswordService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create reset password token' })
  @ApiBody({ type: CreateTokenResetPasswordDto })
  @ApiResponse({
    status: 201,
    description: 'Reset password token created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTokenResetPasswordDto: CreateTokenResetPasswordDto) {
    return this.tokenResetPasswordService.create(createTokenResetPasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reset password token' })
  @ApiParam({ name: 'id', description: 'Token ID' })
  @ApiResponse({
    status: 200,
    description: 'Reset password token deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Token not found' })
  remove(@Param('id') id: string) {
    return this.tokenResetPasswordService.remove(+id);
  }
}
