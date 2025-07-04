import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from '@category/entities/category.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AwsModule } from 'aws/aws.module';
import { UtilsModule } from 'utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), AwsModule, UtilsModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
