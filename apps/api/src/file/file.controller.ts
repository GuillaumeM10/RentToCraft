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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileDto } from '@rent-to-craft/dtos';
import { AuthGuard } from 'src/auth/guard/jwt-passport.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { FileService } from './file.service';

@ApiTags('Files')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new file' })
  @ApiBody({ type: FileDto })
  @ApiResponse({
    status: 201,
    description: 'File created successfully',
    type: FileDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createFileDto: FileDto) {
    return this.fileService.create(createFileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get multiple files by IDs' })
  @ApiBody({
    schema: {
      type: 'array',
      items: { type: 'number' },
      description: 'Array of file IDs',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Files retrieved successfully',
    type: [FileDto],
  })
  async findMultiples(@Body() filesId: FileDto['id'][]) {
    return this.fileService.findMultiples(filesId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully',
    type: FileDto,
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.fileService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiBody({ type: FileDto })
  @ApiResponse({
    status: 200,
    description: 'File updated successfully',
    type: FileDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateFileDto: FileDto,
  ) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.fileService.remove(+id);
  }

  @Post('clear')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('administrator')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear unused files (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Unused files cleared successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async clearNotUsedFiles() {
    return this.fileService.clearNotUsedFiles();
  }
}
