import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'node:path';

import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return isProduction ? {
            transport: {
              host: process.env.MAIL_HOST,
              port: +process.env.MAIL_PORT,
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
              },
            },
            defaults: {
              from: `"No Reply" <${process.env.MAIL_FROM}>`,
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          } : {
            transport: {
              host: process.env.MAIL_HOST || 'localhost',
              port: +process.env.MAIL_PORT || 25,
              secure: false,
            },
            defaults: {
              from: '"No Reply" <noreply@example.com>',
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
