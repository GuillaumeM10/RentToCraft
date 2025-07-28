import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { RentalCatEntity } from './entities/rental-cat.entity';
import { RentalCatController } from './rental-cat.controller';
import { RentalCatService } from './rental-cat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalCatEntity]),
    JwtModule,
    ValidTokenModule,
  ],
  controllers: [RentalCatController],
  providers: [RentalCatService],
  exports: [RentalCatService],
})
export class RentalCatModule {}
