import { IsNotEmpty, MaxLength } from 'class-validator';

import { EntityConstant } from '../../shared/constants/entity.constant';

export class TagDto {
  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  name: string;

  postId: string;
}
