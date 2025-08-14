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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartItemDto } from '@rent-to-craft/dtos';
import { UserDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

import { CartItemService } from './cart-item.service';

@ApiTags('Cart Items')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: CartItemDto })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCartItemDto: CartItemDto, @User() user: UserDto) {
    return this.cartItemService.create(createCartItemDto, user);
  }

  @Get('cart/:cartId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all items in a cart' })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart items retrieved successfully',
    type: [CartItemDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  findAll(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartItemService.findAll(cartId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cart item by ID' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart item retrieved successfully',
    type: CartItemDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiBody({ type: CartItemDto })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: CartItemDto,
  ) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove all items from user cart' })
  @ApiResponse({
    status: 200,
    description: 'All cart items removed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeAll(@User() user: UserDto) {
    return this.cartItemService.removeAll(user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart item removed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.remove(+id);
  }
}
