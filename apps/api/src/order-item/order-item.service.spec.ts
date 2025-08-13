import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type OrderItemDto } from '@rent-to-craft/dtos';

import { OrderService } from '../order/order.service';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;

  const mockOrderItem = {
    id: 1,
    quantity: 2,
    order: { id: 1 },
    rental: { id: 1, name: 'Test Rental' },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockOrderItems = [mockOrderItem];

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockOrderItems),
      getOne: jest.fn().mockResolvedValue(mockOrderItem),
    })),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrderService = {
    // Mock methods if needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: getRepositoryToken(OrderItemEntity),
          useValue: mockRepository,
        },
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all order items for an order', async () => {
      const orderId = 1;
      const expectedOrderItems = [mockOrderItem];

      const result = await service.findAll(orderId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedOrderItems);
    });
  });

  describe('findOne', () => {
    it('should return a single order item', async () => {
      const orderItemId = 1;

      const result = await service.findOne(orderItemId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockOrderItem);
    });
  });

  describe('update', () => {
    it('should update an order item successfully', async () => {
      const orderItemId = 1;
      const updateOrderItemDto: OrderItemDto = {
        id: 1,
        quantity: 3,
        order: { id: 1 },
        rental: { id: 1, name: 'Test Rental' },
      };

      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(orderItemId, updateOrderItemDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        orderItemId,
        updateOrderItemDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove an order item successfully', async () => {
      const orderItemId = 1;
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(orderItemId);

      expect(mockRepository.delete).toHaveBeenCalledWith(orderItemId);
      expect(result).toEqual(deleteResult);
    });
  });
});
