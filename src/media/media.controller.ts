import { Controller, Get, UseGuards } from '@nestjs/common';

import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('make-file')
  makeFile(@CurrentUser() currentUser) {
    return this.mediaService.makeFile(currentUser.id);
  }
}
