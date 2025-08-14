import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { CityDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { CityService } from './city.service';

@ApiTags('Cities')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new city (Admin only)' })
  @ApiBody({ type: CityDto })
  @ApiResponse({
    status: 201,
    description: 'City created successfully',
    type: CityDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  create(@Body() createCityDto: CityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({
    status: 200,
    description: 'Cities retrieved successfully',
    type: [CityDto],
  })
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiParam({ name: 'id', description: 'City ID' })
  @ApiResponse({
    status: 200,
    description: 'City retrieved successfully',
    type: CityDto,
  })
  @ApiResponse({ status: 404, description: 'City not found' })
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search cities by query' })
  @ApiParam({ name: 'query', description: 'Search query' })
  @ApiResponse({
    status: 200,
    description: 'Cities found successfully',
    type: [CityDto],
  })
  search(@Param('query') query: string) {
    return this.cityService.search(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update city (Admin only)' })
  @ApiParam({ name: 'id', description: 'City ID' })
  @ApiBody({ type: CityDto })
  @ApiResponse({
    status: 200,
    description: 'City updated successfully',
    type: CityDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'City not found' })
  update(@Param('id') id: string, @Body() updateCityDto: CityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete city (Admin only)' })
  @ApiParam({ name: 'id', description: 'City ID' })
  @ApiResponse({
    status: 200,
    description: 'City deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'City not found' })
  remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
