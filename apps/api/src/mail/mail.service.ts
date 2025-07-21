import { ConflictException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateTokenResetPasswordDto, UserDto } from '@rent-to-craft/dtos';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'FADR : Mail de confirmation',
        template: './confirmation',
        context: {
          name: user.firstName,
        },
      });
    } catch (error) {
      console.log(error);

      throw new ConflictException(
        `Le mail n'a pas pu être envoyé à ${user.email}`,
      );
    }
  }

  async create(
    createTokenResetPasswordDto: CreateTokenResetPasswordDto,
    token: string,
  ) {
    const url = `${process.env.FRONT_URL}/auth/reset-password/${token}`;

    try {
      await this.mailerService.sendMail({
        to: createTokenResetPasswordDto.email,
        subject: 'YDAYS DADR : Mail de changement de mot de passe',
        template: './reset-password',
        context: {
          url,
        },
      });
    } catch (error) {
      console.log(error);

      throw new ConflictException(
        `Le mail n'a pas pu être envoyé à ${createTokenResetPasswordDto.email}`,
      );
    }
  }
}
