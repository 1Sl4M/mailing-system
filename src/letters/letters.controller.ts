import { Controller, Get, Param, Inject, Post, Body, Query, NotFoundException } from "@nestjs/common";
import { MailService } from "../users/mail.service";
import { LetterService } from "./letter.service";
import { UsersService } from "../users/users.service";
import { CreateLetterDto } from "./dto/create-letter.dto";
import { Letters } from "../entity/letters.entity";
import { Spam } from "../entity/spam.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller('letters')
export class LettersController {
  constructor(
    @Inject(MailService) private readonly mailService: MailService,
    private readonly letterService: LetterService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @InjectRepository(Spam) private readonly spamRepository: Repository<Spam>
  ) {}

  @Get('send-email/:id')
  async sendEmail(@Param('id') id: number, @Query('email') email: string) {
    try {
      const letter = await this.letterService.getLetterFromDatabase(id);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      await this.mailService.sendMail(user.email, letter.theme, letter.content);

      return 'Письмо успешно отправлено';
    } catch (error) {
      return 'Ошибка при отправке письма: ' + error.message;
    }
  }

  @Get('send-email/:id/:groupId')
  async sendMailToGroupMembers(@Param('groupId') groupId: number, @Param('id') id: number) {
    const letter = await this.letterService.getLetterFromDatabase(id);

    await this.mailService.sendMailToGroupMembers(groupId, letter.theme, letter.content)

    const spam = new Spam();
    spam.group_id = groupId;
    spam.letter_id = id;

    await this.spamRepository.save(spam);

    return 'Письмо отправлено в группу';
  }


  @Post()
  async createLetter(@Body() dto: CreateLetterDto) {
    return await this.letterService.createLetter(dto);
  }
}