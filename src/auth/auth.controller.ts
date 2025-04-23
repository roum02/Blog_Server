import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';

// 프론트에서 code 받아옴
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @ApiOperation({ summary: '카카오 로그인 처리' })
  async kakaoLogin(
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.getKakaoUserInfo(body.code);
    // 로그인 성공 후 토큰 발급 & 쿠키에 저장
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1시간
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return { message: '로그인 성공', user };
  }
}
