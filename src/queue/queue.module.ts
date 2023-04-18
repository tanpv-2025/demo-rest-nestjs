import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { QueueService } from './queue.service';
import { QueueConStant } from './queue.constant';
import { SendMailProcessor } from './processor/sendmail.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueConStant.names.sendEmail,
    }),
    MailModule,
  ],
  providers: [QueueService, SendMailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
