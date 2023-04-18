import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { MailConStant } from './mail.constant';
import { TSendEmailData } from './types';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: TSendEmailData): Promise<void> {
    await this.mailerService.sendMail({
      to: data.userEmails,
      subject: data.post.title,
      template: MailConStant.templates.createPost,
      context: {
        post: {
          title: data.post.title,
          description: data.post.description,
          url: `${MailConStant.appFEUrl}/posts/${data.post.id}`,
        },
      },
    });
  }
}
