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

  async createOrUpdateByKakao(
    kakaoId: string,
    nickname: string,
  ): Promise<User> {
    let user = await this.findByKakaoId(kakaoId);

    if (!user) {
      const userCount = await this.userRepository.count();
      const role = userCount === 0 ? UserRole.ADMIN : UserRole.USER;

      user = this.userRepository.create({ kakaoId, nickname, role });
      await this.userRepository.save(user);
    }

    return user;
  }
}
