import { config } from 'dotenv';

config();

const isDevEnv = process.env.NODE_ENV === 'development';

export const MediaConStant = {
  pdfDocument: {
    options: {
      size: 'A4',
      permissions: { modifying: false },
      margin: 20,
    },
    fileNames: {
      output: 'output',
    },
    header: 'This is header',
    footer: 'This is footer',
  },
  s3: {
    config: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
      ...(isDevEnv && {
        endpoint: process.env.AWS_ENDPOINT,
        forcePathStyle: true,
      }),
    },
    bucket: process.env.AWS_BUCKET_NAME,
    presignedUrl: {
      expiresIn: 3600,
    },
  },
};
