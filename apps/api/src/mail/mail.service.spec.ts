import { ConflictException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { type CreateTokenResetPasswordDto } from '@rent-to-craft/dtos';

import { createMockUser } from '../test-helpers/user-mock.helper';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendUserConfirmation', () => {
    const mockUser = createMockUser();

    it('should send confirmation email successfully', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);

      await service.sendUserConfirmation(mockUser);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockUser.email,
        subject: 'FADR : Mail de confirmation',
        template: './confirmation',
        context: {
          name: mockUser.firstName,
        },
      });
    });

    it('should throw ConflictException when email sending fails', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error("Erreur d'envoi d'email"));
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await expect(service.sendUserConfirmation(mockUser)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.sendUserConfirmation(mockUser)).rejects.toThrow(
        `Le mail n'a pas pu être envoyé à ${mockUser.email}`,
      );

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const mockCreateTokenDto: CreateTokenResetPasswordDto = {
      email: 'test@example.com',
    };
    const mockToken = 'test-token-123';

    beforeEach(() => {
      process.env.FRONT_URL = 'http://localhost:3000';
    });

    it('should send reset password email successfully', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);
      const expectedUrl = `${process.env.FRONT_URL}/auth/reset-password/${mockToken}`;

      await service.create(mockCreateTokenDto, mockToken);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockCreateTokenDto.email,
        subject: 'YDAYS DADR : Mail de changement de mot de passe',
        template: './reset-password',
        context: {
          url: expectedUrl,
        },
      });
    });

    it('should throw ConflictException when reset password email sending fails', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error("Erreur d'envoi d'email"));
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        service.create(mockCreateTokenDto, mockToken),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.create(mockCreateTokenDto, mockToken),
      ).rejects.toThrow(
        `Le mail n'a pas pu être envoyé à ${mockCreateTokenDto.email}`,
      );

      expect(console.log).toHaveBeenCalled();
    });

    it('should construct correct URL with token', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);
      const customToken = 'custom-token-456';
      const expectedUrl = `${process.env.FRONT_URL}/auth/reset-password/${customToken}`;

      await service.create(mockCreateTokenDto, customToken);

      const sendMailCall = (mailerService.sendMail as jest.Mock).mock
        .calls[0][0];
      expect(sendMailCall.context.url).toBe(expectedUrl);
    });
  });
});
