import {
  ClassSerializerInterceptor,
  type INestApplication,
  Logger,
} from '@nestjs/common';
import { type CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CleanNullInterceptor } from './common/interceptors/clean-null.interceptor';
import { DateTransformInterceptor } from './common/interceptors/date-transform.interceptor';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  registerGlobals(app);

  const config = new DocumentBuilder()
    .setTitle('Rent To Craft API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.API_PORT ?? 3000);
  Logger.log(
    `Server running on http://localhost:${process.env.API_PORT ?? 3000}`,
  );
  Logger.log(
    `API Documentation available at http://localhost:${process.env.API_PORT ?? 3000}/api`,
  );
}

/**
 *
 */
export function registerGlobals(app: INestApplication) {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'exposeAll',
      excludeExtraneousValues: false,
    }),
    new CleanNullInterceptor(),
    new DateTransformInterceptor(),
  );
}

bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
