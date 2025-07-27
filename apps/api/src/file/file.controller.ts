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
import { FileDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async create(@Body() createFileDto: FileDto) {
    return this.fileService.create(createFileDto);
  }

  @Get()
  async findMultiples(@Body() filesId: FileDto['id'][]) {
    return this.fileService.findMultiples(filesId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.fileService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateFileDto: FileDto,
  ) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.fileService.remove(+id);
  }

  @Post('clear')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  async clearNotUsedFiles() {
    return this.fileService.clearNotUsedFiles();
  }
}
