import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { OrderItemModule } from 'src/order-item/order-item.module';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    JwtModule,
    ValidTokenModule,
    forwardRef(() => OrderItemModule),
    forwardRef(() => CartItemModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
