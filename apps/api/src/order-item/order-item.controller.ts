import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { OrderItemDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { OrderItemService } from './order-item.service';

@ApiTags('Order Items')
@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get('order/:orderId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all items in an order (Admin only)' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order items retrieved successfully',
    type: [OrderItemDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findAll(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderItemService.findAll(orderId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order item by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({
    status: 200,
    description: 'Order item retrieved successfully',
    type: OrderItemDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order item (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiBody({ type: OrderItemDto })
  @ApiResponse({
    status: 200,
    description: 'Order item updated successfully',
    type: OrderItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItemDto: OrderItemDto,
  ) {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete order item (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({
    status: 200,
    description: 'Order item deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.remove(id);
  }
}
