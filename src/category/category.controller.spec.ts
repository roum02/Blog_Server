import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpPost()
  @ApiOperation({
    summary: '카테고리 생성',
    description: '새로운 카테고리를 등록합니다.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: '카테고리 생성 성공' })
  @ApiResponse({ status: 400, description: '요청 형식 오류' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: '모든 카테고리 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리 목록 반환',
    type: [Category],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '카테고리 조회',
    description: 'ID로 특정 카테고리를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiResponse({ status: 200, description: '카테고리 조회 성공' })
  @ApiResponse({
    status: 200,
    description: '카테고리 조회 성공',
    type: Category,
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '카테고리 수정',
    description: 'ID로 특정 카테고리 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '카테고리를 찾을 수 없음' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '카테고리 삭제',
    description: 'ID로 카테고리를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '카테고리 ID' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '카테고리를 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
