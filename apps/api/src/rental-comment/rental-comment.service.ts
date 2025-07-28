import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalCommentDto, UserDto } from '@rent-to-craft/dtos';
import { plainToInstance } from 'class-transformer';
import { RentalService } from 'src/rental/rental.service';
import { Repository } from 'typeorm';

import { RentalCommentEntity } from './entities/rental-comment.entity';

@Injectable()
export class RentalCommentService {
  constructor(
    @InjectRepository(RentalCommentEntity)
    private readonly commentRepository: Repository<RentalCommentEntity>,
    @Inject(forwardRef(() => RentalService))
    private readonly rentalService: RentalService,
  ) {}

  async create(createCommentDto: RentalCommentDto, user: UserDto) {
    if (!createCommentDto.content || createCommentDto.content.trim() === '') {
      throw new HttpException(
        'Le contenu du commentaire est obligatoire.',
        400,
      );
    }

    const rental = await this.rentalService.findOne(createCommentDto.rental.id);
    if (!rental) {
      throw new NotFoundException(
        `Location #${createCommentDto.rental.id} introuvable.`,
      );
    }

    if (createCommentDto.replyTo) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.replyTo.id },
      });
      if (!parentComment) {
        throw new NotFoundException(
          `Commentaire #${createCommentDto.replyTo.id} introuvable.`,
        );
      }
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      author: user,
      rental: rental,
    });

    return plainToInstance(
      RentalCommentDto,
      await this.commentRepository.save(newComment),
    );
  }

  async findByRental(rentalId: number) {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.rental = :rentalId', { rentalId })
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.replyTo', 'replyTo')
      .orderBy('comment.createdAt', 'DESC')
      .getMany();

    return comments.map((comment) =>
      plainToInstance(RentalCommentDto, comment),
    );
  }

  async findOne(id: number) {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id })
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.rental', 'rental')
      .leftJoinAndSelect('comment.replyTo', 'replyTo')
      .getOne();

    if (!comment) {
      throw new NotFoundException(`Commentaire #${id} introuvable.`);
    }

    return plainToInstance(RentalCommentDto, comment);
  }

  async update(id: number, updateCommentDto: RentalCommentDto, user: UserDto) {
    const comment = await this.findOne(id);

    if (comment.author.id !== user.id && user.role !== 'administrator') {
      throw new HttpException('Unauthorized', 401);
    }

    const commentUpdate = {
      ...comment,
      ...updateCommentDto,
    };

    await this.commentRepository.save(commentUpdate);
    return plainToInstance(RentalCommentDto, commentUpdate);
  }

  async remove(id: number, user: UserDto) {
    const comment = await this.findOne(id);

    if (comment.author.id !== user.id && user.role !== 'administrator') {
      throw new HttpException('Unauthorized', 401);
    }

    await this.commentRepository.softDelete(id);

    return {
      message: `Commentaire #${id} supprimé.`,
    };
  }
}
