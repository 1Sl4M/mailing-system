import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'shopalovis@gmail.com',
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
