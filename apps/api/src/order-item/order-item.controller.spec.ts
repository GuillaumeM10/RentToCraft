import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { type OrderItemDto } from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let orderItemService: OrderItemService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        {
          provide: OrderItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
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

    controller = module.get<OrderItemController>(OrderItemController);
    orderItemService = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all order items for an order', async () => {
      jest
        .spyOn(orderItemService, 'findAll')
        .mockResolvedValue(mockOrderItems as never);

      const result = await controller.findAll(1);

      expect(result).toEqual(mockOrderItems);
      expect(orderItemService.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a single order item', async () => {
      jest
        .spyOn(orderItemService, 'findOne')
        .mockResolvedValue(mockOrderItem as never);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockOrderItem);
      expect(orderItemService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an order item', async () => {
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

      jest.spyOn(orderItemService, 'update').mockResolvedValue(updateResult);

      const result = await controller.update(1, updateOrderItemDto);

      expect(result).toEqual(updateResult);
      expect(orderItemService.update).toHaveBeenCalledWith(
        1,
        updateOrderItemDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an order item', async () => {
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(orderItemService, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove(1);

      expect(result).toEqual(deleteResult);
      expect(orderItemService.remove).toHaveBeenCalledWith(1);
    });
  });
});
