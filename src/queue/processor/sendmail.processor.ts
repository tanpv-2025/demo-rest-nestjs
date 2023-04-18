import { Inject, LoggerService } from '@nestjs/common';
import { Job } from 'bull';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Processor, Process, OnQueueFailed, OnQueueError } from '@nestjs/bull';

import { QueueConStant } from '../queue.constant';
import { MailService } from '../../mail/mail.service';
import { TSendEmailData } from '../../mail/types';

@Processor(QueueConStant.names.sendEmail)
export class SendMailProcessor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly mailService: MailService,
  ) {}

  @Process(QueueConStant.names.sendEmail)
  async sendMail(job: Job<TSendEmailData>): Promise<void> {
    await this.mailService.sendEmail(job.data);
  }

  @OnQueueError()
  onQueueError(err: Error) {
    this.logger.error(
      err.message,
      err.stack,
      SendMailProcessor.name,
    );
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.logger.error(
      `${err.message} on ${job.name}`,
      err.stack,
      SendMailProcessor.name,
    );
  }
}
