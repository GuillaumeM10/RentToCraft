import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValidTokenEntity } from './entities/valid-token.entity';
import { ValidTokenController } from './valid-token.controller';
import { ValidTokenService } from './valid-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([ValidTokenEntity])],
  controllers: [ValidTokenController],
  providers: [ValidTokenService],
  exports: [ValidTokenService],
})
export class ValidTokenModule {}
