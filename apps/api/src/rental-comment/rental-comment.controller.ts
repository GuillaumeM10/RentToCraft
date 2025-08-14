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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RentalCommentDto, UserDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { User } from 'src/decorator/user.decorator';

import { RentalCommentService } from './rental-comment.service';

@ApiTags('Rental Comments')
@Controller('rental-comment')
export class RentalCommentController {
  constructor(private readonly rentalCommentService: RentalCommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rental comment' })
  @ApiBody({ type: RentalCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: RentalCommentDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createRentalCommentDto: Partial<RentalCommentDto>,
    @User() user: UserDto,
  ) {
    return this.rentalCommentService.create(createRentalCommentDto, user);
  }

  @Get(':rentalId')
  @ApiOperation({ summary: 'Get comments by rental ID' })
  @ApiParam({ name: 'rentalId', description: 'Rental ID' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [RentalCommentDto],
  })
  @ApiResponse({ status: 404, description: 'Rental not found' })
  findByRental(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.rentalCommentService.findByRental(rentalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: RentalCommentDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalCommentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiBody({ type: RentalCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: RentalCommentDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalCommentDto: RentalCommentDto,
    @User() user: UserDto,
  ) {
    return this.rentalCommentService.update(id, updateRentalCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.rentalCommentService.remove(id, user);
  }
}
