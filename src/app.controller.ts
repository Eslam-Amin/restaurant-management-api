import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get the root endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Hello World',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
