import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  type FileDto,
  MessageDto,
  type RentalCatDto,
  RentalDto,
  type UserDto,
  UserRole,
} from '@rent-to-craft/dtos';
import { plainToInstance } from 'class-transformer';

import { FileService } from '../file/file.service';
import { RentalCatService } from '../rental-cat/rental-cat.service';
import { RentalEntity } from './entities/rental.entity';
import { RentalService } from './rental.service';

describe('RentalService', () => {
  let service: RentalService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rentalRepository: any;
  let fileService: FileService;
  let rentalCatService: RentalCatService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.user,
    // eslint-disable-next-line sonarjs/no-hardcoded-credentials
    password: 'hashedPassword',
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

  const mockRental: RentalDto = {
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

  const mockFile: FileDto = {
    id: 1,
    file: '/uploads/test.jpg',
    name: 'test.jpg',
  };

  const mockCategory: RentalCatDto = {
    id: 1,
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
    rentals: null,
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
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  const mockFileService = {
    create: jest.fn(),
    remove: jest.fn(),
  };

  const mockRentalCatService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        {
          provide: getRepositoryToken(RentalEntity),
          useValue: mockRepository,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: RentalCatService,
          useValue: mockRentalCatService,
        },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
    rentalRepository = module.get(getRepositoryToken(RentalEntity));
    fileService = module.get<FileService>(FileService);
    rentalCatService = module.get<RentalCatService>(RentalCatService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRentalDto: Partial<RentalDto> = {
      name: 'Test Rental',
      description: 'Test Description',
    };

    const mockFiles = {
      images: [new File([''], 'test.jpg')],
    };

    it('should create a rental with images successfully', async () => {
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalCatService, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      const result = await service.create(
        createRentalDto as RentalDto,
        mockFiles,
        mockUser,
      );

      expect(fileService.create).toHaveBeenCalledWith(mockFiles.images[0]);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should create a rental with categories successfully', async () => {
      const createRentalWithCats = {
        ...createRentalDto,
        cats: ['1', '2'],
      };
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalCatService, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      const result = await service.create(
        createRentalWithCats as unknown as RentalDto,
        mockFiles,
        mockUser,
      );

      expect(rentalCatService.findOne).toHaveBeenCalledTimes(2);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should create a rental with array of category objects', async () => {
      const createRentalWithCatObjects = {
        ...createRentalDto,
        cats: [{ id: 1 }, { id: 2 }],
      };
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalCatService, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      const result = await service.create(
        createRentalWithCatObjects as unknown as RentalDto,
        mockFiles,
        mockUser,
      );

      expect(rentalCatService.findOne).toHaveBeenCalledTimes(2);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should create a rental with empty images array', async () => {
      const filesWithEmptyImages = { images: [] };
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      const result = await service.create(
        createRentalDto as RentalDto,
        filesWithEmptyImages,
        mockUser,
      );

      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should use existing user if provided in DTO', async () => {
      const createRentalWithUser = {
        ...createRentalDto,
        user: { ...mockUser, id: 999 },
      };
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      await service.create(
        createRentalWithUser as RentalDto,
        mockFiles,
        mockUser,
      );

      expect(rentalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { ...mockUser, id: 999 },
        }),
      );
    });

    it('should throw HttpException when no images provided', async () => {
      const filesWithoutImages = { images: undefined };

      await expect(
        service.create(
          createRentalDto as RentalDto,
          filesWithoutImages,
          mockUser,
        ),
      ).rejects.toThrow(HttpException);
    });

    it('should generate slug when not provided', async () => {
      const createRentalWithoutSlug = { ...createRentalDto };
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      await service.create(
        createRentalWithoutSlug as RentalDto,
        mockFiles,
        mockUser,
      );

      expect(rentalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: expect.stringMatching(/test-rental-\d+/),
        }),
      );
    });

    it('should handle file upload errors', async () => {
      jest
        .spyOn(fileService, 'create')
        .mockRejectedValue(new Error("Échec de l'upload"));

      await expect(
        service.create(createRentalDto as RentalDto, mockFiles, mockUser),
      ).rejects.toThrow("Échec de l'upload");
    });
  });

  describe('findAll', () => {
    it('should return all rentals without filters', async () => {
      const mockRentals = [mockRental];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRentals),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.images',
        'images',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.user',
        'user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.cats',
        'cats',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'rental.createdAt',
        'DESC',
      );
      expect(result).toEqual(
        mockRentals.map((rental) => plainToInstance(RentalDto, rental)),
      );
    });

    it('should apply search filter', async () => {
      const mockRentals = [mockRental];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRentals),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await service.findAll({ search: 'test' });

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'rental.name ILIKE :search OR rental.description ILIKE :search',
        { search: '%test%' },
      );
    });

    it('should apply category filter', async () => {
      const mockRentals = [mockRental];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRentals),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await service.findAll({ category: '1' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'cats.id = :categoryId',
        { categoryId: '1' },
      );
    });

    it('should apply pagination', async () => {
      const mockRentals = [mockRental];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRentals),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await service.findAll({ page: 1, limit: 10 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should throw NotFoundException when no rentals found', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUser', () => {
    it('should return rentals for a specific user', async () => {
      const mockRentals = [mockRental];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRentals),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findAllByUser(1);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'rental.user.id = :userId',
        { userId: 1 },
      );
      expect(result).toEqual(
        mockRentals.map((rental) => plainToInstance(RentalDto, rental)),
      );
    });

    it('should throw NotFoundException when no rentals found for user', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await expect(service.findAllByUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find rental by ID', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRental),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(1);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('rental.id = :id', {
        id: 1,
      });
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should find rental by slug', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRental),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findOne('test-slug');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'rental.slug = :slug',
        { slug: 'test-slug' },
      );
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should throw NotFoundException when rental not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should find rental by slug', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRental),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findBySlug('test-slug');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'rental.slug = :slug',
        { slug: 'test-slug' },
      );
      expect(result).toEqual(plainToInstance(RentalDto, mockRental));
    });

    it('should throw NotFoundException when rental not found by slug', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      jest
        .spyOn(rentalRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await expect(service.findBySlug('test-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateRentalDto: Partial<RentalDto> = {
      name: 'Updated Rental',
      description: 'Updated Description',
    };

    it('should update rental successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest.spyOn(rentalCatService, 'findOne').mockResolvedValue(mockCategory);
      const updatedRental = { ...mockRental, ...updateRentalDto };
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(updatedRental);

      const result = await service.update(
        1,
        updateRentalDto as RentalDto,
        mockUser,
      );

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, updatedRental));
    });

    it('should update rental with categories successfully', async () => {
      const updateWithCats = {
        ...updateRentalDto,
        cats: ['1', '2'],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest.spyOn(rentalCatService, 'findOne').mockResolvedValue(mockCategory);
      const updatedRental = { ...mockRental, ...updateWithCats };
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(updatedRental);

      const result = await service.update(
        1,
        updateWithCats as unknown as RentalDto,
        mockUser,
      );

      expect(rentalCatService.findOne).toHaveBeenCalledTimes(2);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, updatedRental));
    });

    it('should update rental with array of category objects', async () => {
      const updateWithCatObjects = {
        ...updateRentalDto,
        cats: [{ id: 1 }, { id: 2 }],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest.spyOn(rentalCatService, 'findOne').mockResolvedValue(mockCategory);
      const updatedRental = { ...mockRental, ...updateWithCatObjects };
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(updatedRental);

      const result = await service.update(
        1,
        updateWithCatObjects as unknown as RentalDto,
        mockUser,
      );

      expect(rentalCatService.findOne).toHaveBeenCalledTimes(2);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(RentalDto, updatedRental));
    });

    it('should throw NotFoundException when rental not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(1, updateRentalDto as RentalDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException when user is not authorized', async () => {
      const unauthorizedUser = { ...mockUser, id: 999 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);

      await expect(
        service.update(1, updateRentalDto as RentalDto, unauthorizedUser),
      ).rejects.toThrow(HttpException);
    });

    it('should allow administrator to update any rental', async () => {
      const adminUser = { ...mockUser, role: UserRole.administrator };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest
        .spyOn(rentalRepository, 'save')
        .mockResolvedValue({ ...mockRental, ...updateRentalDto });

      const result = await service.update(
        1,
        updateRentalDto as RentalDto,
        adminUser,
      );

      expect(result).toBeDefined();
    });

    it('should update slug when name changes', async () => {
      const updateWithNewName = { name: 'New Name' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest
        .spyOn(rentalRepository, 'save')
        .mockResolvedValue({ ...mockRental, ...updateWithNewName });

      await service.update(1, updateWithNewName as RentalDto, mockUser);

      expect(rentalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: expect.stringMatching(/new-name/),
        }),
      );
    });

    it('should not update slug when name does not change', async () => {
      const updateWithSameName = { name: mockRental.name };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest
        .spyOn(rentalRepository, 'save')
        .mockResolvedValue({ ...mockRental, ...updateWithSameName });

      await service.update(1, updateWithSameName as RentalDto, mockUser);

      expect(rentalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: mockRental.slug,
        }),
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      jest.spyOn(fileService, 'remove').mockResolvedValue(undefined);

      const result = await service.deleteFile(1);

      expect(fileService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        plainToInstance(MessageDto, {
          message: 'Le fichier #1 a été supprimé.',
        }),
      );
    });
  });

  describe('uploadFile', () => {
    const mockFiles = [new File([''], 'test.jpg')];

    it('should upload files successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      const result = await service.uploadFile(mockFiles, mockUser, 1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(fileService.create).toHaveBeenCalledWith(mockFiles[0]);
      expect(rentalRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(MessageDto, mockRental));
    });

    it('should upload files to rental with existing images', async () => {
      const rentalWithImages = { ...mockRental, images: [mockFile] };
      jest.spyOn(service, 'findOne').mockResolvedValue(rentalWithImages);
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(rentalWithImages);

      const result = await service.uploadFile(mockFiles, mockUser, 1);

      expect(rentalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          images: [mockFile, mockFile],
        }),
      );
      expect(result).toEqual(plainToInstance(MessageDto, rentalWithImages));
    });

    it('should upload files to rental without existing images', async () => {
      const rentalWithoutImages = { ...mockRental, images: null };
      jest.spyOn(service, 'findOne').mockResolvedValue(rentalWithoutImages);
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest
        .spyOn(rentalRepository, 'save')
        .mockResolvedValue(rentalWithoutImages);

      const result = await service.uploadFile(mockFiles, mockUser, 1);

      expect(rentalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          images: [mockFile],
        }),
      );
      expect(result).toEqual(plainToInstance(MessageDto, rentalWithoutImages));
    });

    it('should allow administrator to upload files to any rental', async () => {
      const adminUser = { ...mockUser, role: UserRole.administrator };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest.spyOn(fileService, 'create').mockResolvedValue(mockFile);
      jest.spyOn(rentalRepository, 'save').mockResolvedValue(mockRental);

      const result = await service.uploadFile(mockFiles, adminUser, 1);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when rental not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.uploadFile(mockFiles, mockUser, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException when user is not authorized', async () => {
      const unauthorizedUser = { ...mockUser, id: 999 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);

      await expect(
        service.uploadFile(mockFiles, unauthorizedUser, 1),
      ).rejects.toThrow(HttpException);
    });

    it('should handle file upload errors', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest
        .spyOn(fileService, 'create')
        .mockRejectedValue(new Error("Échec de l'upload"));

      await expect(service.uploadFile(mockFiles, mockUser, 1)).rejects.toThrow(
        "Échec de l'upload",
      );
    });
  });

  describe('remove', () => {
    it('should remove rental successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);
      jest.spyOn(rentalRepository, 'softDelete').mockResolvedValue(undefined);

      const result = await service.remove(1, mockUser);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(rentalRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'La location #1 a été supprimée.',
      });
    });

    it('should throw NotFoundException when rental not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException when user is not authorized', async () => {
      const unauthorizedUser = { ...mockUser, id: 999 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRental);

      await expect(service.remove(1, unauthorizedUser)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOneRentalFiles', () => {
    it('should return rental images', async () => {
      const rentalWithImages = { ...mockRental, images: [mockFile] };
      jest.spyOn(service, 'findOne').mockResolvedValue(rentalWithImages);

      const result = await service.getOneRentalFiles(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockFile]);
    });
  });

  describe('getAllFilesIds', () => {
    it('should return all file IDs from rentals', async () => {
      const rentalsWithImages = [
        { images: [{ id: 1 }, { id: 2 }] },
        { images: [{ id: 3 }] },
        { images: [] },
      ];
      jest.spyOn(rentalRepository, 'find').mockResolvedValue(rentalsWithImages);

      const result = await service.getAllFilesIds();

      expect(rentalRepository.find).toHaveBeenCalledWith({
        select: ['images'],
        relations: ['images'],
      });
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when no rentals with images', async () => {
      const rentalsWithoutImages = [{ images: [] }, { images: null }];
      jest
        .spyOn(rentalRepository, 'find')
        .mockResolvedValue(rentalsWithoutImages);

      const result = await service.getAllFilesIds();

      expect(result).toEqual([]);
    });
  });
});
