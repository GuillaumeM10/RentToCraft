import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RentalCommentDto, UserDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

import { RentalCommentService } from './rental-comment.service';

@Controller('rental-comment')
export class RentalCommentController {
  constructor(private readonly rentalCommentService: RentalCommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createRentalCommentDto: RentalCommentDto,
    @User() user: UserDto,
  ) {
    return this.rentalCommentService.create(createRentalCommentDto, user);
  }

  @Get(':rentalId')
  findByRental(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.rentalCommentService.findByRental(rentalId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalCommentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalCommentDto: RentalCommentDto,
    @User() user: UserDto,
  ) {
    return this.rentalCommentService.update(id, updateRentalCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.rentalCommentService.remove(id, user);
  }
}
