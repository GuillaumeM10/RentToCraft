import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    forwardRef(() => CartItemModule),
    JwtModule,
    ValidTokenModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
