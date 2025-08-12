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
import { CartItemDto } from '@rent-to-craft/dtos';
import { UserDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

import { CartItemService } from './cart-item.service';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCartItemDto: CartItemDto, @User() user: UserDto) {
    return this.cartItemService.create(createCartItemDto, user);
  }

  @Get('cart/:cartId')
  @UseGuards(AuthGuard)
  findAll(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartItemService.findAll(cartId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: CartItemDto,
  ) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.remove(+id);
  }

  @Delete('all')
  @UseGuards(AuthGuard)
  removeAll(@User() user: UserDto) {
    return this.cartItemService.removeAll(user);
  }
}
