import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EntityConstant } from '../../shared/constants/entity.constant';
import { Post } from '../../entities/post.entity';
import { TagDto } from '../../tag/dto/create-tag.dto';

export class CreatePostDto {
  static resource = Post.name;

  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsOptional()
  @MaxLength(EntityConstant.longLength)
  description: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];

  userId: string;

  filePath: string;
}
