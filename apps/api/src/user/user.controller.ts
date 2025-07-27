import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserDto, UserUpdateDto } from '@rent-to-craft/dtos';
import { File } from 'multer';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { User } from '../decorator/user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUser: UserDto) {
    return this.userService.create(createUser);
  }

  @Get()
  findAll(@Query() queries) {
    return this.userService.findAll(queries);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePicture' }, { name: 'banner' }]),
  )
  update(
    @Body() updateUserDto: UserUpdateDto,
    @User() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      banner?: File[];
      profilePicture?: File[];
    },
  ) {
    return this.userService.update(updateUserDto, user, id, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  softDelete(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.userService.softDelete(+id, user);
  }
}
