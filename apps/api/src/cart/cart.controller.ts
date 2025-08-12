import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartDto, UserDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@User() user: UserDto) {
    return this.cartService.create(user);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  findAll() {
    return this.cartService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  findOne(@User() user: UserDto) {
    return this.cartService.findOne(user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: CartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
