import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response as ExpressResponse } from 'express';

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
      //secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60, // 1시간
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return { message: '로그인 성공', user };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Access Token 재발급' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token이 없습니다.');
    }

    const { accessToken, newRefreshToken } =
      await this.authService.reissueAccessToken(refreshToken);

    // 새 AccessToken 저장
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60, // 1시간
    });

    // 새 RefreshToken 저장
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return { message: '토큰 재발급 성공' };
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token이 없습니다.');
    }

    await this.authService.logout(refreshToken);

    // 쿠키 삭제
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: '로그아웃 성공' };
  }
}
