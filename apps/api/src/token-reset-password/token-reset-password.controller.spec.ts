import { Test, type TestingModule } from '@nestjs/testing';
import {
  type CreateTokenResetPasswordDto,
  type MessageDto,
  type ValidtokenDto,
} from '@rent-to-craft/dtos';

import { createMockUser } from '../test-helpers/user-mock.helper';
import { TokenResetPasswordController } from './token-reset-password.controller';
import { TokenResetPasswordService } from './token-reset-password.service';

describe('TokenResetPasswordController', () => {
  let controller: TokenResetPasswordController;
  let service: jest.Mocked<TokenResetPasswordService>;

  const mockToken: ValidtokenDto = {
    id: 1,
    token: 'test-token-uuid',
    user: createMockUser(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenResetPasswordController],
      providers: [
        {
          provide: TokenResetPasswordService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TokenResetPasswordController>(
      TokenResetPasswordController,
    );
    service = module.get(TokenResetPasswordService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a password reset token', async () => {
      const createDto: CreateTokenResetPasswordDto = {
        email: 'test@example.com',
      };

      service.create.mockResolvedValue(mockToken);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockToken);
    });

    it('should handle service errors', async () => {
      const createDto: CreateTokenResetPasswordDto = {
        email: 'notfound@example.com',
      };

      service.create.mockRejectedValue(
        new Error("Cet utilisateur n'existe pas."),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        "Cet utilisateur n'existe pas.",
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle database errors', async () => {
      const createDto: CreateTokenResetPasswordDto = {
        email: 'test@example.com',
      };

      service.create.mockRejectedValue(
        new Error('Échec de connexion à la base de données'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'Échec de connexion à la base de données',
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('remove', () => {
    it('should remove a password reset token', async () => {
      const mockResponse: MessageDto = {
        message: 'Token supprimé',
      };

      service.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle service errors during removal', async () => {
      service.remove.mockRejectedValue(
        new Error('Erreur lors de la suppresion du token'),
      );

      await expect(controller.remove('1')).rejects.toThrow(
        'Erreur lors de la suppresion du token',
      );
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should convert string id to number', async () => {
      const mockResponse: MessageDto = {
        message: 'Token supprimé',
      };

      service.remove.mockResolvedValue(mockResponse);

      await controller.remove('123');

      expect(service.remove).toHaveBeenCalledWith(123);
    });

    it('should handle zero id', async () => {
      const mockResponse: MessageDto = {
        message: 'Token supprimé',
      };

      service.remove.mockResolvedValue(mockResponse);

      await controller.remove('0');

      expect(service.remove).toHaveBeenCalledWith(0);
    });

    it('should handle negative id', async () => {
      const mockResponse: MessageDto = {
        message: 'Token supprimé',
      };

      service.remove.mockResolvedValue(mockResponse);

      await controller.remove('-1');

      expect(service.remove).toHaveBeenCalledWith(-1);
    });

    it('should handle database errors during removal', async () => {
      service.remove.mockRejectedValue(
        new Error('Échec de connexion à la base de données'),
      );

      await expect(controller.remove('1')).rejects.toThrow(
        'Échec de connexion à la base de données',
      );
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
