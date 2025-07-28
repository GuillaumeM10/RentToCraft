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
import { RentalCatDto } from '@rent-to-craft/dtos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { RentalCatService } from './rental-cat.service';

@Controller('rental-cat')
export class RentalCatController {
  constructor(private readonly rentalCatService: RentalCatService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  create(@Body() createRentalCatDto: RentalCatDto) {
    return this.rentalCatService.create(createRentalCatDto);
  }

  @Get()
  findAll() {
    return this.rentalCatService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.rentalCatService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalCatDto: RentalCatDto,
  ) {
    return this.rentalCatService.update(id, updateRentalCatDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentalCatService.remove(id);
  }
}
