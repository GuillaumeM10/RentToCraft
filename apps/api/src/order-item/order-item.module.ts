import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from 'src/order/order.module';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemEntity]),
    JwtModule,
    ValidTokenModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
