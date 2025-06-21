import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Category } from '@category/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AwsService } from 'aws/aws.service';
import { UtilsService } from 'utils/utils.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { categoryId, ...rest } = createPostDto;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    const post = this.postRepository.create({
      ...rest,
      category,
    });
    return this.postRepository.save(post);
  }

  async findAll({
    categoryId,
    sortBy = 'latest',
    limit,
  }: {
    categoryId?: number;
    sortBy?: 'latest' | 'views' | 'comments';
    limit?: number;
  }) {
    // QueryBuilder
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.comments', 'comment')
      // .loadRelationCountAndMap('post.commentCount', 'post.comments');
      .loadRelationCountAndMap('post.commentCount', 'post.comments');

    if (categoryId) {
      query.andWhere('post.categoryId = :categoryId', { categoryId });
    }

    query.andWhere('post.isPublished = true'); // 공개 게시글만

    switch (sortBy) {
      case 'views':
        query.orderBy('post.viewCount', 'DESC');
        break;
      case 'comments':
        query.orderBy('post.commentCount', 'DESC');
        break;
      case 'latest':
      default:
        query.orderBy('post.createdAt', 'DESC');
        break;
    }

    if (limit) {
      query.take(limit);
    }

    const [posts, totalCount] = await query.getManyAndCount();

    return { posts, totalCount };
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (post) {
      // viewCount 증가
      await this.postRepository.increment({ id }, 'viewCount', 1);
      post.viewCount += 1; // 반환되는 객체에도 증가된 값 반영
    }

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }

  // 이미지 파일을 받아 이를 AWS S3에 업로드하는 역할
  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  // 이미지 파일과 이미지 이름을 받아 이를 AWS S3에 업로드하고, 업로드된 이미지의 URL을 반환하는 역할
  async imageUpload(file: Express.Multer.File) {
    // 고유한 이미지 이름을 생성
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    if (!ext) {
      throw new Error('파일 확장자를 알 수 없습니다.');
    }

    // AWS S3에 이미지를 업로드
    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }

  // 이미지 지우기
  async removeImage(imageKey: string) {
    await this.awsService.deleteImage(imageKey);
  }
}
