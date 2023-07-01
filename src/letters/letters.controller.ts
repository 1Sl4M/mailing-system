import {
  Controller,
  Get,
  Param,
  Inject,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException
} from "@nestjs/common";
import { MailService } from "./mail.service";
import { LettersService } from "./letters.service";
import { UsersService } from "../users/users.service";
import { CreateLetterDto } from "./dto/create-letter.dto";
import { Spam } from "../entity/spam.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Letters } from "../entity/letters.entity";

@Controller('letters')
export class LettersController {
  constructor(
    @Inject(MailService) private readonly mailService: MailService,
    private readonly letterService: LettersService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @InjectRepository(Spam) private readonly spamRepository: Repository<Spam>,
    @InjectRepository(Letters) private readonly letterRepository: Repository<Letters>
  ) {}

  @Get()
  async getAllLetters() {
    return this.letterService.getAllLetters();
  }

  @Get('send-email/:id')
  async sendEmail(@Param('id') id: number, @Query('email') email: string) {
    try {
      const letter = await this.letterService.getOneLetter(id);

      const user = await this.usersService.findByEmailForSendMessage(email);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      await this.mailService.sendMail(user.email, letter.theme, letter.content);

      return 'Письмо успешно отправлено';
    } catch (error) {
      return 'Ошибка при отправке письма: ' + error.message;
    }
  }

  @Get('spam')
  async getAllSpams() {
    return this.letterService.getAllSpams();
  }

  @Get(':letterId')
  async findLetters(@Param('letterId') letterId: number) {
    return this.letterService.findLetters(letterId);
  }

  @Get('send-email/:id/:groupId')
  async sendMailToGroupMembers(@Param('groupId') groupId: number, @Param('id') id: number) {
    const letter = await this.letterService.getOneLetter(id);

    if(!letter) {
      throw new BadRequestException('Letter not found');
    }

    let newDate = new Date();

    const spam = new Spam();
    spam.group_id = groupId;
    spam.letter_id = id;
    spam.created_at = newDate;

    await this.spamRepository.save(spam);

    await this.mailService.sendMailToGroupMembers(groupId, letter.theme, letter.content, spam, spam.id)

    return 'Письмо отправлено в группу';
  }

  @Post()
  async createLetter(@Body() dto: CreateLetterDto) {
    return await this.letterService.createLetter(dto);
  }
}
