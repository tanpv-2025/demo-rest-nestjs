import { config } from 'dotenv';

config();

export default {
  host: process.env.MAIL_HOST,
  port: +process.env.MAIL_PORT,
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
  mailFrom: {
    address: process.env.MAIL_FROM_ADDRESS,
    name: process.env.MAIL_FROM_NAME,
  },
};
