import { nodemailerTransporter } from '../nodemailer.transporter';

import type { ISendEmail } from '../interfaces/send-email.interface';

export class SendEmailService {
  public static async execute({ from, to, subject, body }: ISendEmail) {
    await nodemailerTransporter.sendMail({
      from,
      to,
      subject,
      html: body,
    });
  }
}
