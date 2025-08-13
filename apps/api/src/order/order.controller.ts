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
import { OrderDto, UserDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';

import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: OrderDto, @User() user: UserDto) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  findAllByUser(@User() user: UserDto) {
    return this.orderService.findAllByUser(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: OrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
