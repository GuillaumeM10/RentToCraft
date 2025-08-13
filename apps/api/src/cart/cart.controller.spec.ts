import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type CartDto, type UserDto, UserRole } from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

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

  const mockCart = {
    id: 1,
    user: mockUser,
    cartItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ValidTokenService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart successfully', async () => {
      jest.spyOn(cartService, 'create').mockResolvedValue(mockCart as never);

      const result = await controller.create(mockUser);

      expect(cartService.create).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockCart);
    });
  });

  describe('findAll', () => {
    it('should return all carts', async () => {
      const mockCarts = [mockCart];
      jest.spyOn(cartService, 'findAll').mockResolvedValue(mockCarts as never);

      const result = await controller.findAll();

      expect(result).toEqual(mockCarts);
      expect(cartService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cart for a specific user', async () => {
      jest.spyOn(cartService, 'findOne').mockResolvedValue(mockCart as never);

      const result = await controller.findOne(mockUser);

      expect(result).toEqual(mockCart);
      expect(cartService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('update', () => {
    it('should update a cart', async () => {
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

      jest.spyOn(cartService, 'update').mockResolvedValue(updateResult);

      const result = await controller.update(1, updateCartDto);

      expect(result).toEqual(updateResult);
      expect(cartService.update).toHaveBeenCalledWith(1, updateCartDto);
    });
  });

  describe('remove', () => {
    it('should remove a cart', async () => {
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(cartService, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove(1);

      expect(result).toEqual(deleteResult);
      expect(cartService.remove).toHaveBeenCalledWith(1);
    });
  });
});
