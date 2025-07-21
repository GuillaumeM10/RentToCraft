import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateTokenResetPasswordDto } from '@rent-to-craft/dtos';

import { TokenResetPasswordService } from './token-reset-password.service';

@Controller('token-reset-password')
export class TokenResetPasswordController {
  constructor(
    private readonly tokenResetPasswordService: TokenResetPasswordService,
  ) {}

  @Post()
  create(@Body() createTokenResetPasswordDto: CreateTokenResetPasswordDto) {
    return this.tokenResetPasswordService.create(createTokenResetPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenResetPasswordService.remove(+id);
  }
}
