import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import {
  type OrderDto,
  OrderStatus,
  type UserDto,
  UserRole,
} from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

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

  const mockOrder = {
    id: 1,
    user: mockUser,
    total: 100,
    orderItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    status: OrderStatus.pending,
  };

  const mockOrders = [mockOrder];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllByUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            verifyAsync: jest.fn(),
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

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: OrderDto = {
        id: null,
        total: 100,
        orderItems: [],
        user: mockUser,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        status: OrderStatus.pending,
      };

      jest.spyOn(orderService, 'create').mockResolvedValue(mockOrder as never);

      const result = await controller.create(createOrderDto, mockUser);

      expect(result).toEqual(mockOrder);
      expect(orderService.create).toHaveBeenCalledWith(
        createOrderDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      jest
        .spyOn(orderService, 'findAll')
        .mockResolvedValue(mockOrders as never);

      const result = await controller.findAll();

      expect(result).toEqual(mockOrders);
      expect(orderService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return orders for a specific user', async () => {
      jest
        .spyOn(orderService, 'findAllByUser')
        .mockResolvedValue(mockOrders as never);

      const result = await controller.findAllByUser(mockUser);

      expect(result).toEqual(mockOrders);
      expect(orderService.findAllByUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      jest.spyOn(orderService, 'findOne').mockResolvedValue(mockOrder as never);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockOrder);
      expect(orderService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: OrderDto = {
        id: 1,
        total: 150,
        orderItems: [],
        user: mockUser,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        status: OrderStatus.confirmed,
      };

      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(orderService, 'update').mockResolvedValue(updateResult);

      const result = await controller.update(1, updateOrderDto);

      expect(result).toEqual(updateResult);
      expect(orderService.update).toHaveBeenCalledWith(1, updateOrderDto);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(orderService, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove(1);

      expect(result).toEqual(deleteResult);
      expect(orderService.remove).toHaveBeenCalledWith(1);
    });
  });
});
