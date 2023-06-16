import { Injectable, NotFoundException } from "@nestjs/common";
import { createTransport } from 'nodemailer';
import { InjectRepository } from "@nestjs/typeorm";
import { Groups } from "../entity/groups.entity";
import { Repository } from "typeorm";
import { Users } from "../entity/users.entity";
import { Spam } from "../entity/spam.entity";

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Groups) private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Spam) private readonly spamRepository: Repository<Spam>,
    ) {}
  
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

  async sendMailToGroupMembers(groupId: number, subject: string, text: string): Promise<void> {
    const users = await this.usersRepository.find({
      where: {
        groups: {
          id: groupId,
        },
      },
    });

    for (const user of users) {
      await this.sendMail(user.email, subject, text);
    }
  }

}
