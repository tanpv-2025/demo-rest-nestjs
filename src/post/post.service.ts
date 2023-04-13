import { Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import {
  removeFileFromPath,
  writeFileToTempDir,
} from '../shared/ultils/file.util';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(
    createPostDto: CreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Post | null> {
    const filePath: string = await writeFileToTempDir(file);

    try {
      return this.postRepository.createPost({
        ...createPostDto,
        userId,
        filePath,
      });
    } catch (error) {
      await removeFileFromPath(filePath);
      return null;
    }
  }

  async findAll(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        userId,
      },
      order: {
        created: 'desc',
      },
      relations: {
        tags: true,
      },
    });
  }

  async findOne(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.removePost(id);
  }
}
