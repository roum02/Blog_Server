import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '@posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({ example: 1, description: '카테고리 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tech', description: '카테고리 이름' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    example: '기술 관련 글을 모은 카테고리',
    description: '카테고리 설명',
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
