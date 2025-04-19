import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
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
    default: UserRole.USER,
    description: '사용자 권한',
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ example: '2025-04-19T12:00:00Z', description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;
}
