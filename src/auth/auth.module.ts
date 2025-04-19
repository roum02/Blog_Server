import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // 다른 모듈에서도 .env 사용 가능하게
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
