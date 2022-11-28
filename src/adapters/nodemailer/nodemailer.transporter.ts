import nodemailer from 'nodemailer';

const {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_AUTH_USER,
  NODEMAILER_AUTH_PASS,
} = process.env;

export const nodemailerTransporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  auth: {
    user: NODEMAILER_AUTH_USER,
    pass: NODEMAILER_AUTH_PASS,
  },
});
