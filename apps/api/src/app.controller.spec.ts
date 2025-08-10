import { Test, type TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return a message from AppService', () => {
      const expectedResult = { message: 'RentToCraft API' };
      jest.spyOn(appService, 'getHello').mockReturnValue(expectedResult);

      const result = appController.getHello();

      expect(result).toEqual(expectedResult);
      expect(appService.getHello).toHaveBeenCalled();
    });
  });
});
