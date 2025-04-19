import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
// 파일 읽어옴
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UserService } from '@user/user.service';
import { JwtService } from '@nestjs/jwt';

// 카카오 토큰 요청 + 유저 정보 요청
@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService,
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
    const nickname =
      userResponse.data.kakao_account.profile?.nickname ??
      generateRandomNickname();

    // 3. 사용자 DB에 등록 or 조회
    const user = await this.userService.createOrUpdateByKakao(
      kakaoId,
      nickname,
    );

    const token = this.jwtService.sign({ sub: user.id }); // JWT 발급

    // 4. JWT 발급 등 추가 가능
    return {
      message: '로그인 성공',
      user,
      token,
    };
  }
}

function generateRandomNickname(): string {
  const adjectives = [
    '귀여운',
    '상냥한',
    '용감한',
    '조용한',
    '명랑한',
    '지혜로운',
    '신속한',
    '수줍은',
    '기발한',
    '멋진',
    '느긋한',
    '진지한',
    '차분한',
    '강렬한',
    '온화한',
    '의젓한',
    '엉뚱한',
    '활발한',
    '독특한',
    '섬세한',
    '유쾌한',
    '용의주도한',
    '재치있는',
    '의리있는',
    '단단한',
    '명민한',
    '기운찬',
    '침착한',
    '쾌활한',
    '대담한',
    '다정한',
    '눈부신',
    '순수한',
    '똑똑한',
    '엉성한',
    '성실한',
    '반짝이는',
    '성급한',
    '깜찍한',
    '기분좋은',
    '불타는',
    '청초한',
    '호기심많은',
    '부드러운',
    '귀신같은',
    '차가운',
    '따뜻한',
    '은은한',
    '흐릿한',
    '풍부한',
  ];

  const nouns = [
    '도토리',
    '여우',
    '하마',
    '다람쥐',
    '돌고래',
    '호랑이',
    '나비',
    '독수리',
    '늑대',
    '펭귄',
    '고래',
    '올빼미',
    '청설모',
    '고양이',
    '사자',
    '캥거루',
    '부엉이',
    '치타',
    '도마뱀',
    '청개구리',
    '물고기',
    '고슴도치',
    '문어',
    '새우',
    '오징어',
    '벌새',
    '해달',
    '기린',
    '카멜레온',
    '토끼',
    '거북이',
    '장수풍뎅이',
    '나무늘보',
    '햄스터',
    '코끼리',
    '팬더',
    '이구아나',
    '메뚜기',
    '말',
    '돼지',
    '앵무새',
    '지렁이',
    '비둘기',
    '하늘소',
    '쥐',
    '사슴',
    '참새',
    '거미',
    '벌',
    '수달',
  ];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000~9999

  return `익명의 ${randomAdj}${randomNoun}${randomNumber}`;
}
