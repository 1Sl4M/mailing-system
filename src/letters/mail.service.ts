import { Injectable } from "@nestjs/common";
import { createTransport } from 'nodemailer';
import { InjectRepository } from "@nestjs/typeorm";
import { Groups } from "../entity/groups.entity";
import { Repository } from "typeorm";
import { Users } from "../entity/users.entity";
import { Spam } from "../entity/spam.entity";
import { SentUsers } from "../entity/sent_users.entity";

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Groups) private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Spam) private readonly spamRepository: Repository<Spam>,
    @InjectRepository(SentUsers) private readonly sentUsersRepository: Repository<SentUsers>,
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

  async sendMailToGroupMembers(groupId: number, subject: string, text: string, spam: any, spamId: number): Promise<void> {
    let i = 0;
    let failedUsers = 0;

    const users = await this.usersRepository.find({
      where: {
        groups: {
          id: groupId,
        },
      },
    });

    for (const user of users) {
      const sentUser = new SentUsers();
      sentUser.user_id = user.id;
      sentUser.spam_id = spamId;

      try {
        await this.sendMail(user.email, subject, text);
        sentUser.status_code = 'SUCCESS';
        i++;
      } catch (e) {
        sentUser.status_code = 'FAIL';
        failedUsers++;
      }

      await this.sentUsersRepository.save(sentUser);

      if (i === users.length) {
        spam.status_code = 'SUCCESS';
      } else if(failedUsers === users.length ) {
        spam.status_code = 'FAIL';
      }else if (failedUsers > 0) {
        spam.status_code = 'PARTIAL';
      }

      await this.spamRepository.save(spam);
    }
  }
}
