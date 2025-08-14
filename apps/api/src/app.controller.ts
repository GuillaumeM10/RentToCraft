import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({
    status: 200,
    description: 'Application is running',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }
}
