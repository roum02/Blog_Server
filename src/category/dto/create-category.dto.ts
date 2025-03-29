import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tech', description: '카테고리 이름' })
  name: string;

  @ApiProperty({
    example: '기술 관련 글을 모은 카테고리',
    description: '설명',
    required: false,
  })
  description?: string;
}
