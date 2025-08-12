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
import { CityDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  create(@Body() createCityDto: CityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Get('search/:query')
  search(@Param('query') query: string) {
    return this.cityService.search(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  update(@Param('id') id: string, @Body() updateCityDto: CityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
