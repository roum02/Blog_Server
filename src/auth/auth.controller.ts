import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// 프론트에서 code 받아옴
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  async kakaoLogin(@Body('code') code: string) {
    const kakaoUser = await this.authService.getKakaoUserInfo(code);
    return kakaoUser; // TODO: 여기에 JWT 발급 or DB 저장 추가
  }
}
