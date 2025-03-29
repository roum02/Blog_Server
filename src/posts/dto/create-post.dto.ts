import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'NestJS 소개', description: '게시글 제목' })
  title: string;

  @ApiProperty({ example: 'NestJS는...', description: '본문 내용' })
  content: string;

  @ApiProperty({ example: 1, description: '카테고리 ID' })
  categoryId: number;

  @ApiProperty({ example: 1, description: '작성자 ID' })
  authorId: number;

  @ApiProperty({ example: true, required: false, description: '공개 여부' })
  isPublished?: boolean;
}
