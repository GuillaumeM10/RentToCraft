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
import { RentalService } from 'src/rental/rental.service';
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
    @Inject(forwardRef(() => RentalService))
    private readonly rentalService: RentalService,
  ) {}

  async create(file: File): Promise<FileDto> {
    const optimizedFile = await this.optimizeFile(file);

    const fileName = file.originalname.split('.');
    fileName[fileName.length - 1] = 'webp';
    file.originalname = fileName.join('.');

    const fileDto = {
      name: file.originalname,
      file: optimizedFile,
      id: null,
    };

    const newFile = this.fileRepository.create(fileDto);
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
    return { message: `Fichier avec l'ID ${id} supprimé avec succès` };
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
    const [userFiles, rentalFiles] = await Promise.all([
      this.userService.getAllFilesIds(),
      this.rentalService.getAllFilesIds(),
    ]);

    const normalizeIds = (files: unknown): number[] => {
      if (!Array.isArray(files)) return [];
      return files.map(Number).filter((id) => !Number.isNaN(id));
    };

    const userFileIds = normalizeIds(userFiles);
    const rentalFileIds = normalizeIds(rentalFiles);

    const allUsedFileIds = [...new Set([...rentalFileIds, ...userFileIds])];

    const query = this.fileRepository.createQueryBuilder('file');

    if (allUsedFileIds.length > 0) {
      query.where('file.id NOT IN (:...usedIds)', { usedIds: allUsedFileIds });
    }

    const unusedFiles = await query.getMany();

    if (unusedFiles.length > 0) {
      await this.fileRepository.remove(unusedFiles);
      console.log(`${unusedFiles.length} fichiers supprimés`);
    } else {
      console.log('Aucun fichier à supprimer');
    }

    return unusedFiles.map((file) => plainToInstance(FileDto, file));
  }
}
