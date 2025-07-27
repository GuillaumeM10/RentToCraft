import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TokenResetPasswordModule } from './token-reset-password/token-reset-password.module';
import { UserModule } from './user/user.module';
import { ValidTokenModule } from './valid-token/valid-token.module';

const isProduction = process.env.NODE_ENV === 'production';
console.log('isProductionDB', isProduction);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRoot(
      isProduction
        ? {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            ssl: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            autoLoadEntities: true,
            // extra: {
            //   min: 2,
            //   max: 5
            // }
          }
        : {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number.parseInt(process.env.POSTGRES_PORT),
            password: process.env.POSTGRES_PASSWORD,
            username: process.env.POSTGRES_USER,
            autoLoadEntities: true,
            database: process.env.POSTGRES_DB,
            synchronize: true,
            logging: false,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
          },
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    AuthModule,
    TokenResetPasswordModule,
    MailModule,
    ValidTokenModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
