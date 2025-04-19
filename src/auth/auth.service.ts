import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
// 파일 읽어옴
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// 카카오 토큰 요청 + 유저 정보 요청
@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getKakaoUserInfo(code: string) {
    const clientId = this.config.get('KAKAO_CLIENT_ID');
    const redirectUri = this.config.get('KAKAO_REDIRECT_URI');

    const tokenResponse = await firstValueFrom(
      this.http.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ),
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await firstValueFrom(
      this.http.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return userResponse.data;
  }
}
