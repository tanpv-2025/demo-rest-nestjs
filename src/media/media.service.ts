import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
  S3,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommandInputType,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { MediaConStant } from './media.constant';
import { PDFCreator } from './creator/pdf.creator';

@Injectable()
export class MediaService {
  private readonly s3Client: S3;

  constructor() {
    this.s3Client = new S3(MediaConStant.s3.config);
  }

  async putFileToS3(input: PutObjectCommandInputType): Promise<void> {
    try {
      const command = new PutObjectCommand(input);
      await this.s3Client.send(command);
    } catch (error) {
      throw new BadRequestException(
        'Upload file failed',
        error.message && { cause: error.message },
      );
    }
  }

  async getPresignedUrl(Key: string): Promise<string> {
    try {
      const input: GetObjectCommandInput = {
        Bucket: MediaConStant.s3.bucket,
        Key,
      };
      const getCommand = new GetObjectCommand(input);
      const url = await getSignedUrl(
        this.s3Client,
        getCommand,
        MediaConStant.s3.presignedUrl,
      );
      return url;
    } catch (error) {
      return '';
    }
  }

  async generatePdfFile(): Promise<Buffer> {
    try {
      const pdfCreator = new PDFCreator(
        MediaConStant.pdfDocument.options,
        MediaConStant.pdfDocument.header,
        MediaConStant.pdfDocument.footer,
      );
      pdfCreator.addHeader();
      pdfCreator.loadContent();
      pdfCreator.addFooter();
      const pdfFile = await pdfCreator.createBufferPdf();

      return pdfFile;
    } catch (error) {
      throw new BadRequestException(
        'Generate PDF file failed',
        error.message && { cause: error.message },
      );
    }
  }

  async makeFile(userId: string): Promise<void> {
    const file: Buffer = await this.generatePdfFile();
    const fileName = `${uuid()}-${
      MediaConStant.pdfDocument.fileNames.output
    }.pdf`;
    const input: PutObjectCommandInputType = {
      Bucket: MediaConStant.s3.bucket,
      Body: file,
      Key: [userId, fileName].join('/'),
    };
    await this.putFileToS3(input);
  }
}
