import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '테스트 API',
    description: 'root endpoint에서 "Hello World!" 문자열을 반환합니다.',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
