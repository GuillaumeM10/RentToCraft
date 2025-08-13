import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type CartItemDto, type UserDto, UserRole } from '@rent-to-craft/dtos';

import { CartService } from '../cart/cart.service';
import { CartItemService } from './cart-item.service';
import { CartItemEntity } from './entities/cart-item.entity';

describe('CartItemService', () => {
  let service: CartItemService;

  const mockCartItem = {
    id: 1,
    quantity: 2,
    cart: { id: 1 },
    rental: { id: 1, name: 'Test Rental' },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockCartItems = [mockCartItem];

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockCartItems),
      getOne: jest.fn().mockResolvedValue(mockCartItem),
    })),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCartService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: getRepositoryToken(CartItemEntity),
          useValue: mockRepository,
        },
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart item successfully', async () => {
      const createCartItemDto: CartItemDto = {
        id: null,
        quantity: 2,
        cart: { id: 1 },
        rental: { id: 1, name: 'Test Rental' },
      };

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

      const expectedCartItem = { ...mockCartItem };

      mockCartService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.create.mockReturnValue(expectedCartItem);
      mockRepository.save.mockResolvedValue(expectedCartItem);

      const result = await service.create(createCartItemDto, mockUser);

      expect(mockCartService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(mockRepository.create).toHaveBeenCalledWith({
        quantity: createCartItemDto.quantity,
        cart: { id: 1 },
        rental: { id: createCartItemDto.rental.id },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedCartItem);
      expect(result).toEqual(expectedCartItem);
    });
  });

  describe('findAll', () => {
    it('should return all cart items for a cart', async () => {
      const cartId = 1;
      const expectedCartItems = [mockCartItem];

      const result = await service.findAll(cartId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedCartItems);
    });
  });

  describe('findOne', () => {
    it('should return a single cart item', async () => {
      const cartItemId = 1;

      mockRepository.findOne.mockResolvedValue(mockCartItem);

      const result = await service.findOne(cartItemId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: cartItemId, cart: mockCartItem },
      });
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('update', () => {
    it('should update a cart item successfully', async () => {
      const cartItemId = 1;
      const updateCartItemDto: CartItemDto = {
        id: 1,
        quantity: 3,
        cart: { id: 1 },
        rental: { id: 1, name: 'Test Rental' },
      };

      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(cartItemId, updateCartItemDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        cartItemId,
        updateCartItemDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a cart item successfully', async () => {
      const cartItemId = 1;
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(cartItemId);

      expect(mockRepository.delete).toHaveBeenCalledWith(cartItemId);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('removeAll', () => {
    it('should remove all cart items for a user', async () => {
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

      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.removeAll(mockUser);

      expect(mockRepository.delete).toHaveBeenCalled();
      expect(result).toEqual(deleteResult);
    });
  });
});
