import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserDto, UserUpdateDto } from '@rent-to-craft/dtos';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { User } from '../decorator/user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUser: UserDto) {
    return this.userService.create(createUser);
  }

  @Get()
  findAll(@Query() queries) {
    return this.userService.findAll(queries);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Body() updateUserDto: UserUpdateDto,
    @User() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(updateUserDto, user, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  softDelete(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.userService.softDelete(+id, user);
  }
}
