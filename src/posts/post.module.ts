import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from '@category/entities/category.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AwsModule } from 'aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), AwsModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
