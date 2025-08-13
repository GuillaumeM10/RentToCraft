import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  type OrderDto,
  OrderStatus,
  type UserDto,
  UserRole,
} from '@rent-to-craft/dtos';

import { CartItemService } from '../cart-item/cart-item.service';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockOrder]),
      getOne: jest.fn().mockResolvedValue(mockOrder),
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCartItemService = {
    removeAll: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: mockRepository,
        },
        {
          provide: CartItemService,
          useValue: mockCartItemService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
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

      const expectedOrder = { ...mockOrder };

      mockRepository.create.mockReturnValue(expectedOrder);
      mockRepository.save.mockResolvedValue(expectedOrder);
      mockCartItemService.removeAll.mockResolvedValue(undefined);

      const result = await service.create(createOrderDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        total: createOrderDto.total,
        orderItems: createOrderDto.orderItems,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedOrder);
      expect(mockCartItemService.removeAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedOrder);
    });

    it('should create an order with missing password', async () => {
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

      const expectedOrder = { ...mockOrder };

      mockRepository.create.mockReturnValue(expectedOrder);
      mockRepository.save.mockResolvedValue(expectedOrder);
      mockCartItemService.removeAll.mockResolvedValue(undefined);

      const result = await service.create(createOrderDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        total: createOrderDto.total,
        orderItems: createOrderDto.orderItems,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedOrder);
      expect(mockCartItemService.removeAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const expectedOrders = [mockOrder];

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedOrders);
    });
  });

  describe('findAllByUser', () => {
    it('should return orders for a specific user', async () => {
      const userId = 1;
      const expectedOrders = [mockOrder];

      const result = await service.findAllByUser(userId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedOrders);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const orderId = 1;

      const result = await service.findOne(orderId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const orderId = 1;
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

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(orderId, updateOrderDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        orderId,
        updateOrderDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      const orderId = 1;
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(orderId);

      expect(mockRepository.delete).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(deleteResult);
    });
  });
});
