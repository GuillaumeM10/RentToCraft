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

@Controller('user')
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

  @Put('/file')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file' }]))
  uploadFile(
    @UploadedFiles()
    files: {
      file: File[];
    },
    @User() user: UserDto,
    @Body('type') type: 'banner' | 'profilePicture',
  ) {
    return this.userService.uploadFile(type, files.file[0], user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Body() updateUserDto: UserUpdateDto,
    @User() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(updateUserDto, user, id);
  }

  @Delete('/file')
  @UseGuards(AuthGuard)
  deleteFile(
    @Body('type') type: 'banner' | 'profilePicture',
    @User() user: UserDto,
  ) {
    return this.userService.deleteFile(type, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  softDelete(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.userService.softDelete(+id, user);
  }
}
