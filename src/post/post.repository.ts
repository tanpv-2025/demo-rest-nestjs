import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.manager);
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const post: Post = await transactionalEntityManager.save(
        Post,
        createPostDto,
      );

      if (createPostDto.tags && createPostDto.tags.length) {
        const tagData: Tag[] = createPostDto.tags.map((tag: Tag) => ({
          ...tag,
          postId: post.id,
        }));
        await transactionalEntityManager.save(Tag, tagData);
      }
      return post;
    });
  }

  async removePost(id: string): Promise<void> {
    const post: Post = await this.findOne({
      where: { id },
      relations: { tags: true },
    });

    if (post) {
      this.dataSource.transaction(async (transactionalEntityManager) => {
        if (post.tags && post.tags.length) {
          const deleteIds: string[] = post.tags.map((tag) => tag.id);
          await transactionalEntityManager.softDelete(Tag, deleteIds);
        }
        await transactionalEntityManager.softDelete(Post, id);
      });
    } else {
      throw new NotFoundException('Post not found');
    }
  }
}
