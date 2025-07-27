import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDto } from '@rent-to-craft/dtos';
import { plainToInstance } from 'class-transformer';
import { File } from 'multer';
import * as sharp from 'sharp';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(file: FileDto) {
    const newFile = this.fileRepository.create(file);
    return plainToInstance(FileDto, await this.fileRepository.save(newFile));
  }

  async findMultiples(filesId: FileDto['id'][] | { filesId: FileDto['id'][] }) {
    let ids: FileDto['id'][];
    ids =
      typeof filesId === 'object' && 'filesId' in filesId
        ? filesId.filesId
        : filesId;
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    ids = ids.map(Number);

    const query = this.fileRepository.createQueryBuilder('file');
    query.where('file.id IN (:...ids)', { ids });
    const files = await query.getMany();
    return files.map((file) => plainToInstance(FileDto, file));
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    return plainToInstance(FileDto, file);
  }

  async update(id: number, updateFileDto: FileDto) {
    const file = await this.fileRepository.findOne({ where: { id } });
    Object.assign(file, updateFileDto);
    return plainToInstance(FileDto, this.fileRepository.save(file));
  }

  async remove(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    await this.fileRepository.remove(file);
    return { message: `File with ID ${id} deleted successfully` };
  }

  async optimizeFile(file: File) {
    const optimizedBuffer = await sharp(file.buffer)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    if (optimizedBuffer.length > 1 * 1024 * 1024) {
      throw new NotFoundException('Votre image ne doit pas dépasser 1mo');
    }

    const toBase64 = optimizedBuffer.toString('base64');
    return toBase64;
  }

  async clearNotUsedFiles() {
    console.log('cleaning');
    let userFiles = await this.userService.getAllFilesIds();

    if (!Array.isArray(userFiles)) {
      userFiles = [];
    }

    userFiles = userFiles.map(Number);

    const query = this.fileRepository.createQueryBuilder('file');
    query.where('file.id NOT IN (:...userFiles)', { userFiles });
    const unusedFiles = await query.getMany();
    if (unusedFiles.length > 0) {
      await this.fileRepository.remove(unusedFiles);
    }
    return unusedFiles.map((file) => plainToInstance(FileDto, file));
  }
}
