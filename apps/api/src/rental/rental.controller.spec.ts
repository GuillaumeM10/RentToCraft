import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { type RentalDto, type UserDto, UserRole } from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

describe('RentalController', () => {
  let controller: RentalController;
  let service: RentalService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123', // eslint-disable-line sonarjs/no-hardcoded-credentials
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.user,
    isPublic: true,
    description: null,
    address: null,
    phone: null,
    contactEmail: null,
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
    slug: 'test-rental',
    quantity: 1,
    images: [],
    cats: [],
    comments: [],
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRentals = [mockRental];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalController],
      providers: [
        {
          provide: RentalService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRental),
            findAll: jest.fn().mockResolvedValue(mockRentals),
            findAllByUser: jest.fn().mockResolvedValue(mockRentals),
            findAllByUserId: jest.fn().mockResolvedValue(mockRentals),
            findBySlug: jest.fn().mockResolvedValue(mockRental),
            findOne: jest.fn().mockResolvedValue(mockRental),
            uploadFile: jest
              .fn()
              .mockResolvedValue({ message: 'File uploaded successfully' }),
            update: jest.fn().mockResolvedValue(mockRental),
            deleteFile: jest
              .fn()
              .mockResolvedValue({ message: 'File deleted successfully' }),
            remove: jest
              .fn()
              .mockResolvedValue({ message: 'Rental deleted successfully' }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: ValidTokenService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RentalController>(RentalController);
    service = module.get<RentalService>(RentalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a rental', async () => {
      const createRentalDto: RentalDto = {
        id: null,
        name: 'Test Rental',
        description: 'Test Description',
        slug: 'test-rental',
        quantity: 1,
        images: [],
        cats: [],
        comments: [],
        user: mockUser,
      };

      const files = { images: [] };

      const result = await controller.create(createRentalDto, mockUser, files);

      expect(result).toEqual(mockRental);
      expect(service.create).toHaveBeenCalledWith(
        createRentalDto,
        files,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return all rentals', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockRentals);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return rentals for a specific user', async () => {
      const result = await controller.findAllByUser(mockUser);

      expect(result).toEqual(mockRentals);
      expect(service.findAllByUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findAllByUserId', () => {
    it('should return rentals for a specific user ID', async () => {
      const result = await controller.findAllByUserId(1);

      expect(result).toEqual(mockRentals);
      expect(service.findAllByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findBySlug', () => {
    it('should return a rental by slug', async () => {
      const result = await controller.findBySlug('test-rental');

      expect(result).toEqual(mockRental);
      expect(service.findOne).toHaveBeenCalledWith('test-rental');
    });
  });

  describe('findOne', () => {
    it('should return a single rental', async () => {
      const result = await controller.findOne(1);

      expect(result).toEqual(mockRental);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('uploadFile', () => {
    it('should upload a file for a rental', async () => {
      const files = { images: [] };

      const result = await controller.uploadFile(1, files, mockUser);

      expect(result).toEqual({ message: 'File uploaded successfully' });
      expect(service.uploadFile).toHaveBeenCalledWith(
        files.images,
        mockUser,
        1,
      );
    });
  });

  describe('update', () => {
    it('should update a rental', async () => {
      const updateRentalDto: RentalDto = {
        id: 1,
        name: 'Updated Rental',
        description: 'Updated Description',
        slug: 'updated-rental',
        quantity: 2,
        images: [],
        cats: [],
        comments: [],
        user: mockUser,
      };

      const result = await controller.update(1, updateRentalDto, mockUser);

      expect(result).toEqual(mockRental);
      expect(service.update).toHaveBeenCalledWith(1, updateRentalDto, mockUser);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from a rental', async () => {
      const result = await controller.deleteFile(1);

      expect(result).toEqual({ message: 'File deleted successfully' });
      expect(service.deleteFile).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a rental', async () => {
      const result = await controller.remove(1, mockUser);

      expect(result).toEqual({ message: 'Rental deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(1, mockUser);
    });
  });
});
