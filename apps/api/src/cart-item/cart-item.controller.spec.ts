import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { type CartItemDto, type UserDto, UserRole } from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';

describe('CartItemController', () => {
  let controller: CartItemController;
  let cartItemService: CartItemService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword', // eslint-disable-line sonarjs/no-hardcoded-credentials
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: CartItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
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
          provide: ValidTokenService,
          useValue: {
            findByToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartItemController>(CartItemController);
    cartItemService = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart item', async () => {
      const createCartItemDto: CartItemDto = {
        id: null,
        quantity: 2,
        cart: { id: 1 },
        rental: { id: 1, name: 'Test Rental' },
      };

      jest
        .spyOn(cartItemService, 'create')
        .mockResolvedValue(mockCartItem as never);

      const result = await controller.create(createCartItemDto, mockUser);

      expect(result).toEqual(mockCartItem);
      expect(cartItemService.create).toHaveBeenCalledWith(
        createCartItemDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return all cart items for a cart', async () => {
      jest
        .spyOn(cartItemService, 'findAll')
        .mockResolvedValue(mockCartItems as never);

      const result = await controller.findAll(1);

      expect(result).toEqual(mockCartItems);
      expect(cartItemService.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a single cart item', async () => {
      jest
        .spyOn(cartItemService, 'findOne')
        .mockResolvedValue(mockCartItem as never);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockCartItem);
      expect(cartItemService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a cart item', async () => {
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

      jest.spyOn(cartItemService, 'update').mockResolvedValue(updateResult);

      const result = await controller.update(1, updateCartItemDto);

      expect(result).toEqual(updateResult);
      expect(cartItemService.update).toHaveBeenCalledWith(1, updateCartItemDto);
    });
  });

  describe('remove', () => {
    it('should remove a cart item', async () => {
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(cartItemService, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove(1);

      expect(result).toEqual(deleteResult);
      expect(cartItemService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('removeAll', () => {
    it('should remove all cart items for a cart', async () => {
      const deleteResult = {
        affected: 2,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(cartItemService, 'removeAll').mockResolvedValue(deleteResult);

      const result = await controller.removeAll(mockUser);

      expect(result).toEqual(deleteResult);
      expect(cartItemService.removeAll).toHaveBeenCalledWith(mockUser);
    });
  });
});
