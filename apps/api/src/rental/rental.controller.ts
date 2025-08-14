import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RentalDto, UserDto } from '@rent-to-craft/dtos';
import { File } from 'multer';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

import { RentalService } from './rental.service';

@ApiTags('Rentals')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rental' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...Object.getOwnPropertyNames(new RentalDto()).reduce((acc, prop) => {
          acc[prop] = { type: 'string' };
          return acc;
        }, {}),
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Rental images',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rental created successfully',
    type: RentalDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createRentalDto: RentalDto,
    @User() user: UserDto,
    @UploadedFiles()
    files: {
      images?: File[];
    },
  ) {
    return this.rentalService.create(createRentalDto, files, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rentals' })
  @ApiResponse({
    status: 200,
    description: 'Rentals retrieved successfully',
    type: [RentalDto],
  })
  findAll() {
    return this.rentalService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user rentals' })
  @ApiResponse({
    status: 200,
    description: 'User rentals retrieved successfully',
    type: [RentalDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllByUser(@User() user: UserDto) {
    return this.rentalService.findAllByUser(user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get rentals by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User rentals retrieved successfully',
    type: [RentalDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findAllByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.rentalService.findAllByUser(userId);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get rental by slug' })
  @ApiParam({ name: 'slug', description: 'Rental slug' })
  @ApiResponse({
    status: 200,
    description: 'Rental retrieved successfully',
    type: RentalDto,
  })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.rentalService.findOne(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rental by ID' })
  @ApiParam({ name: 'id', description: 'Rental ID' })
  @ApiResponse({
    status: 200,
    description: 'Rental retrieved successfully',
    type: RentalDto,
  })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.findOne(id);
  }

  @Put('/file/:rentalId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload rental images' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'rentalId', description: 'Rental ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Rental images',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Images uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  uploadFile(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @UploadedFiles()
    files: {
      images: File[];
    },
    @User() user: UserDto,
  ) {
    return this.rentalService.uploadFile(files.images, user, rentalId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update rental' })
  @ApiParam({ name: 'id', description: 'Rental ID' })
  @ApiBody({ type: RentalDto })
  @ApiResponse({
    status: 200,
    description: 'Rental updated successfully',
    type: RentalDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: RentalDto,
    @User() user: UserDto,
  ) {
    return this.rentalService.update(id, updateRentalDto, user);
  }

  @Delete('/file/:fileId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete rental file' })
  @ApiParam({ name: 'fileId', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  deleteFile(@Param('fileId', ParseIntPipe) fileId: number) {
    return this.rentalService.deleteFile(fileId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete rental' })
  @ApiParam({ name: 'id', description: 'Rental ID' })
  @ApiResponse({
    status: 200,
    description: 'Rental deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.rentalService.remove(id, user);
  }
}
