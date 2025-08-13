import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  type RentalCommentDto,
  type UserDto,
  UserRole,
} from '@rent-to-craft/dtos';

import { RentalService } from '../rental/rental.service';
import { RentalCommentEntity } from './entities/rental-comment.entity';
import { RentalCommentService } from './rental-comment.service';

describe('RentalCommentService', () => {
  let service: RentalCommentService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.user,
    password: 'hashedPassword', // eslint-disable-line sonarjs/no-hardcoded-credentials
    description: null,
    address: null,
    phone: null,
    contactEmail: null,
    isPublic: true,
    posts: null,
    postComments: null,
    banner: null,
    profilePicture: null,
    city: null,
    rentals: null,
    rentalComments: null,
    cart: null,
    orders: null,
  };

  const mockRental = {
    id: 1,
    name: 'Test Rental',
    description: 'Test Description',
    quantity: 1,
    user: mockUser,
    images: [],
    cats: [],
    slug: 'test-rental-1234567890',
    comments: null,
  };

  const mockComment = {
    id: 1,
    content: 'Test comment',
    author: mockUser,
    rental: mockRental,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  const mockRentalService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalCommentService,
        {
          provide: getRepositoryToken(RentalCommentEntity),
          useValue: mockRepository,
        },
        {
          provide: RentalService,
          useValue: mockRentalService,
        },
      ],
    }).compile();

    service = module.get<RentalCommentService>(RentalCommentService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment successfully', async () => {
      const createCommentDto: Partial<RentalCommentDto> = {
        content: 'Test comment content',
        rental: { id: 1 },
      };

      mockRentalService.findOne.mockResolvedValue(mockRental);
      mockRepository.create.mockReturnValue(mockComment);
      mockRepository.save.mockResolvedValue(mockComment);

      const result = await service.create(createCommentDto, mockUser);

      expect(mockRentalService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        author: mockUser,
        rental: mockRental,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw HttpException when content is empty', async () => {
      const createCommentDto: Partial<RentalCommentDto> = {
        content: '',
        rental: { id: 1 },
      };

      await expect(service.create(createCommentDto, mockUser)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException when content is only whitespace', async () => {
      const createCommentDto: Partial<RentalCommentDto> = {
        content: '   ',
        rental: { id: 1 },
      };

      await expect(service.create(createCommentDto, mockUser)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw NotFoundException when rental not found', async () => {
      const createCommentDto: Partial<RentalCommentDto> = {
        content: 'Test comment',
        rental: { id: 999 },
      };

      mockRentalService.findOne.mockResolvedValue(null);

      await expect(service.create(createCommentDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByRental', () => {
    it('should return comments for a rental', async () => {
      const mockComments = [mockComment];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockComments),
        getOne: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByRental(1);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'comment.rental = :rentalId',
        { rentalId: 1 },
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'comment.author',
        'author',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'comment.createdAt',
        'DESC',
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a comment by ID', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn().mockResolvedValue(mockComment),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(1);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('comment.id = :id', {
        id: 1,
      });
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'comment.author',
        'author',
      );
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when comment not found', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment successfully when user is author', async () => {
      const updateCommentDto: RentalCommentDto = {
        id: 1,
        content: 'Updated comment',
        author: mockUser,
        rental: mockRental,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment);
      mockRepository.save.mockResolvedValue({
        ...mockComment,
        ...updateCommentDto,
      });

      const result = await service.update(1, updateCommentDto, mockUser);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should update a comment successfully when user is administrator', async () => {
      const adminUser = { ...mockUser, role: UserRole.administrator };
      const updateCommentDto: RentalCommentDto = {
        id: 1,
        content: 'Updated comment',
        author: mockUser,
        rental: mockRental,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment);
      jest
        .spyOn(mockRepository, 'save')
        .mockResolvedValue({ ...mockComment, ...updateCommentDto });

      const result = await service.update(1, updateCommentDto, adminUser);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw HttpException when user is not author or administrator', async () => {
      const unauthorizedUser = { ...mockUser, id: 999 };
      const updateCommentDto: RentalCommentDto = {
        id: 1,
        content: 'Updated comment',
        author: mockUser,
        rental: mockRental,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment);

      await expect(
        service.update(1, updateCommentDto, unauthorizedUser),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a comment successfully when user is author', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment);
      jest.spyOn(mockRepository, 'softDelete').mockResolvedValue(undefined);

      const result = await service.remove(1, mockUser);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Commentaire #1 supprimé.',
      });
    });

    it('should remove a comment successfully when user is administrator', async () => {
      const adminUser = { ...mockUser, role: UserRole.administrator };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment);
      jest.spyOn(mockRepository, 'softDelete').mockResolvedValue(undefined);

      const result = await service.remove(1, adminUser);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Commentaire #1 supprimé.',
      });
    });

    it('should throw HttpException when user is not author or administrator', async () => {
      const unauthorizedUser = { ...mockUser, id: 999 };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment);

      await expect(service.remove(1, unauthorizedUser)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
