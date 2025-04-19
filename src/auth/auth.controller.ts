import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// 프론트에서 code 받아옴
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @ApiOperation({ summary: '카카오 로그인 처리' })
  async kakaoLogin(@Body('code') code: string) {
    const kakaoUser = await this.authService.getKakaoUserInfo(code);
    return kakaoUser; // TODO: 여기에 JWT 발급 or DB 저장 추가
  }
}
