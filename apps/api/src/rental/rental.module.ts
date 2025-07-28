import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/file/file.module';
import { RentalCatModule } from 'src/rental-cat/rental-cat.module';
import { RentalCommentModule } from 'src/rental-comment/rental-comment.module';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { RentalEntity } from './entities/rental.entity';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalEntity]),
    JwtModule,
    ValidTokenModule,
    forwardRef(() => FileModule),
    forwardRef(() => RentalCatModule),
    forwardRef(() => RentalCommentModule),
  ],
  controllers: [RentalController],
  providers: [RentalService],
  exports: [RentalService],
})
export class RentalModule {}
