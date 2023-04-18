import { config } from 'dotenv';

config();

export const MailConStant = {
  templates: {
    createPost: 'create-post',
  },
  appFEUrl: process.env.APP_FE_URL,
};
