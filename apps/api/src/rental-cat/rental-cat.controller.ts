import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RentalCatDto } from '@rent-to-craft/dtos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { RentalCatService } from './rental-cat.service';

@ApiTags('Rental Categories')
@Controller('rental-cat')
export class RentalCatController {
  constructor(private readonly rentalCatService: RentalCatService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rental category (Admin only)' })
  @ApiBody({ type: RentalCatDto })
  @ApiResponse({
    status: 201,
    description: 'Rental category created successfully',
    type: RentalCatDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  create(@Body() createRentalCatDto: RentalCatDto) {
    return this.rentalCatService.create(createRentalCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rental categories' })
  @ApiResponse({
    status: 200,
    description: 'Rental categories retrieved successfully',
    type: [RentalCatDto],
  })
  findAll() {
    return this.rentalCatService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get rental category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({
    status: 200,
    description: 'Rental category retrieved successfully',
    type: RentalCatDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('slug') slug: string) {
    return this.rentalCatService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update rental category (Admin only)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: RentalCatDto })
  @ApiResponse({
    status: 200,
    description: 'Rental category updated successfully',
    type: RentalCatDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalCatDto: RentalCatDto,
  ) {
    return this.rentalCatService.update(id, updateRentalCatDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete rental category (Admin only)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Rental category deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentalCatService.remove(id);
  }
}
