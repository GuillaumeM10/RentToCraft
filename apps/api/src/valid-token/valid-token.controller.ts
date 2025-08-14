import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateValidTokenDto, UserDto } from '@rent-to-craft/dtos';

import { User } from '../decorator/user.decorator';
import { ValidTokenService } from './valid-token.service';

@ApiTags('Valid Tokens')
@Controller('valid-jwt')
export class ValidTokenController {
  constructor(private readonly validTokenService: ValidTokenService) {}

  @Post()
  @ApiOperation({ summary: 'Create valid token' })
  @ApiBody({ type: CreateValidTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Valid token created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createValidTokenDto: CreateValidTokenDto) {
    return this.validTokenService.create(createValidTokenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all valid tokens for a user' })
  @ApiQuery({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Valid tokens retrieved successfully',
  })
  findAllByUser(@Query('userId') userId: number) {
    return this.validTokenService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get valid token by JWT' })
  @ApiParam({ name: 'id', description: 'JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Valid token retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Token not found' })
  findOne(@Param('id') jwt: string) {
    return this.validTokenService.findOne(jwt);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete valid token' })
  @ApiParam({ name: 'id', description: 'Token to delete' })
  @ApiResponse({
    status: 200,
    description: 'Valid token deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Token not found' })
  remove(@Param('id') token: string, @User() user: UserDto) {
    return this.validTokenService.remove(token, user.id);
  }
}
