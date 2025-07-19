import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { TokenResetPasswordEntity } from '../token-reset-password/entities/token-reset-password.entity';
import { TokenResetPasswordService } from '../token-reset-password/token-reset-password.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ValidTokenModule } from '../valid-token/valid-token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/passport-jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    MailModule,
    ValidTokenModule,
    TypeOrmModule.forFeature([UserEntity, TokenResetPasswordEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenResetPasswordService, MailService],
})
export class AuthModule {}
