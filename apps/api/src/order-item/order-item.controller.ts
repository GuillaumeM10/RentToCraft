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
import { OrderItemDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get('order/:orderId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  findAll(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderItemService.findAll(orderId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItemDto: OrderItemDto,
  ) {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.remove(id);
  }
}
