import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidTokenModule } from 'src/valid-token/valid-token.module';

import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CityEntity]),
    JwtModule,
    ValidTokenModule,
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {
  constructor(private readonly cityService: CityService) {}

  async onModuleInit() {
    await this.cityService.initData();
  }
}
