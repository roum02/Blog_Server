import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '1923456789', description: '카카오 사용자 ID' })
  @Column({ unique: true })
  kakaoId: string;

  @ApiProperty({ example: '카카오닉네임', description: '카카오 닉네임' })
  @Column()
  nickname: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.GUEST,
    description: '사용자 권한',
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @ApiProperty({ example: '2025-04-19T12:00:00Z', description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  // 나중에 hash 로 저장
  @ApiProperty({ example: 'refresh_token_here', description: '리프레시 토큰' })
  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;
}
