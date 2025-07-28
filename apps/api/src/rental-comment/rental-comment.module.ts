import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalModule } from 'src/rental/rental.module';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { RentalCommentEntity } from './entities/rental-comment.entity';
import { RentalCommentController } from './rental-comment.controller';
import { RentalCommentService } from './rental-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalCommentEntity]),
    JwtModule,
    ValidTokenModule,
    forwardRef(() => RentalModule),
  ],
  controllers: [RentalCommentController],
  providers: [RentalCommentService],
  exports: [RentalCommentService],
})
export class RentalCommentModule {}
