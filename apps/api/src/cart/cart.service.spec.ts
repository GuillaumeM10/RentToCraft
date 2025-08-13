import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type CartDto, type UserDto, UserRole } from '@rent-to-craft/dtos';

import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

describe('CartService', () => {
  let service: CartService;

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

  const mockCart = {
    id: 1,
    user: mockUser,
    cartItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockCarts = [mockCart];

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockCarts),
      getOne: jest.fn().mockResolvedValue(mockCart),
    })),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart successfully', async () => {
      const expectedCart = { ...mockCart };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(expectedCart);

      const result = await service.create(mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({ user: mockUser });
      expect(result).toEqual(expectedCart);
    });
  });

  describe('findAll', () => {
    it('should return all carts', async () => {
      const expectedCarts = [mockCart];

      mockRepository.find.mockResolvedValue(expectedCarts);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedCarts);
    });
  });

  describe('findOne', () => {
    it('should return a cart for a specific user', async () => {
      const userId = 1;

      const result = await service.findOne(userId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });
  });

  describe('update', () => {
    it('should update a cart successfully', async () => {
      const cartId = 1;
      const updateCartDto: CartDto = {
        id: 1,
        user: mockUser,
        cartItems: [],
      };

      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(cartId, updateCartDto);

      expect(mockRepository.update).toHaveBeenCalledWith(cartId, updateCartDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a cart successfully', async () => {
      const cartId = 1;
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(cartId);

      expect(mockRepository.delete).toHaveBeenCalledWith(cartId);
      expect(result).toEqual(deleteResult);
    });
  });
});
