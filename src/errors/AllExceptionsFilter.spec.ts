import { Test, TestingModule } from '@nestjs/testing';

import { HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './AllExceptionsFilter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  it('should catch and handle HttpException', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
        getRequest: () => ({}),
      }),
    } as ArgumentsHost;

    filter.catch(exception, host);

    expect(filter).toBeDefined();
  });

  it('should catch and handle generic error', () => {
    const exception = new Error('Internal Server Error');
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
        getRequest: () => ({}),
      }),
    } as ArgumentsHost;

    filter.catch(exception, host);
    expect(filter).toBeDefined();
  });
});
