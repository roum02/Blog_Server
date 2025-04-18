import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Category } from '@category/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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
  }: {
    categoryId?: number;
    sortBy?: 'latest' | 'views' | 'comments';
  }) {
    // QueryBuilder
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.comments', 'comment')
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

    return await query.getMany();
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
