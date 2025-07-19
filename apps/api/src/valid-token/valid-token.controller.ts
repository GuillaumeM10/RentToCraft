import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserDto } from 'src/user/dtos';

import { User } from '../decorator/user.decorator';
import { CreateValidTokenDto } from './dtos';
import { ValidTokenService } from './valid-token.service';

@Controller('valid-jwt')
export class ValidTokenController {
  constructor(private readonly validTokenService: ValidTokenService) {}

  @Post()
  create(@Body() createValidTokenDto: CreateValidTokenDto) {
    return this.validTokenService.create(createValidTokenDto);
  }

  @Get()
  findAllByUser(@Query('userId') userId: number) {
    return this.validTokenService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') jwt: string) {
    return this.validTokenService.findOne(jwt);
  }

  @Delete(':id')
  remove(@Param('id') token: string, @User() user: UserDto) {
    return this.validTokenService.remove(token, user.id);
  }
}
