import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartItemEntity } from './entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItemEntity]),
    forwardRef(() => CartModule),
    JwtModule,
    ValidTokenModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
