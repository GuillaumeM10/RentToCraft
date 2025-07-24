import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { TokenResetPasswordEntity } from './entities/token-reset-password.entity';
import { TokenResetPasswordController } from './token-reset-password.controller';
import { TokenResetPasswordService } from './token-reset-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenResetPasswordEntity, UserEntity]),
    UserModule,
  ],
  controllers: [TokenResetPasswordController],
  providers: [TokenResetPasswordService],
})
export class TokenResetPasswordModule {}
