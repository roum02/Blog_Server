import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByKakaoId(kakaoId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ kakaoId });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }

  async createOrUpdateByKakao(
    kakaoId: string,
    nickname: string,
    refreshToken?: string,
  ): Promise<User> {
    let user = await this.findByKakaoId(kakaoId);

    if (!user) {
      const userCount = await this.userRepository.count();
      const role = userCount === 0 ? UserRole.ADMIN : UserRole.GUEST;

      user = this.userRepository.create({
        kakaoId,
        nickname,
        role,
        // TODO bcrypt로 암호화 필요
        refreshToken,
      });
    } else if (refreshToken) {
      user.refreshToken = refreshToken; // 기존 사용자에게도 리프레시 토큰 저장
    }

    await this.userRepository.save(user);
    return user;
  }

  async removeRefreshToken(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    user.refreshToken = null;
    await this.userRepository.save(user);
  }
}
