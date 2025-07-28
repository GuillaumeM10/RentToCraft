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
import { RentalDto, UserDto } from '@rent-to-craft/dtos';
import { File } from 'multer';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

import { RentalService } from './rental.service';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
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
  findAll() {
    return this.rentalService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  findAllByUser(@User() user: UserDto) {
    return this.rentalService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: RentalDto,
    @User() user: UserDto,
    @UploadedFiles()
    files: {
      images?: File[];
    },
  ) {
    return this.rentalService.update(id, updateRentalDto, user, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.rentalService.remove(id, user);
  }
}
