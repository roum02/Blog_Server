import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
// 파일 읽어옴
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UserService } from '@user/user.service';

// 카카오 토큰 요청 + 유저 정보 요청
@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}

  async getKakaoUserInfo(code: string) {
    const clientId = this.config.get('KAKAO_CLIENT_ID');
    const redirectUri = this.config.get('KAKAO_REDIRECT_URI');

    // 1. 카카오 토큰 요청
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

    // 2. 카카오 사용자 정보 요청
    const userResponse = await firstValueFrom(
      this.http.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    const kakaoId = String(userResponse.data.id);
    const nickname = userResponse.data.kakao_account.profile.nickname;

    // 3. 사용자 DB에 등록 or 조회
    const user = await this.userService.createOrUpdateByKakao(
      kakaoId,
      nickname,
    );

    // 4. JWT 발급 등 추가 가능
    return {
      message: '로그인 성공',
      user,
    };
  }
}
