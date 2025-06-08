import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  HttpCode,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageUploadDto } from './dto/image-upload.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @ApiOperation({
    summary: '게시글 생성',
    description: '새로운 게시글을 작성합니다.',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: '게시글 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 게시글 조회',
    description: '전체 게시글 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '게시글 목록 반환' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: '카테고리 ID',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['latest', 'views', 'comments'],
    description: '정렬 기준 (latest: 최신순, views: 조회순, comments: 댓글순)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '조회할 게시글 개수 제한',
  })
  findAll(
    @Query('categoryId') categoryId?: number,
    @Query('sortBy') sortBy?: 'latest' | 'views' | 'comments',
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postService.findAll({ categoryId, sortBy, limit });
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 게시글 조회',
    description: 'ID를 기반으로 특정 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 조회 성공' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '게시글 수정',
    description: 'ID를 기반으로 게시글을 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: '게시글 수정 성공' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: 'ID를 기반으로 게시글을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 삭제 성공' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  @ApiOperation({ summary: '게시글 작성, 수정 시 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Post('image')
  // 요청에서 'file'로 전달되는 파일을 인터셉트
  // @UploadedFile() 데코레이터를 통해 해당 파일을 메서드의 매개변수로 전달
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    // 받아온 file이라는 데이터(여기서는 이미지 파일)를 AWS S3라는 클라우드 저장소에 올리고, 그 파일이 저장된 위치인 URL을 반환
    return await this.postService.imageUpload(file);
  }
}
