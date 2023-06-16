import { Controller, Get, Param, Inject, Post, Body, Query, NotFoundException } from "@nestjs/common";
import { MailService } from "../users/mail.service";
import { LetterService } from "./letter.service";
import { UsersService } from "../users/users.service";
import { CreateLetterDto } from "./dto/create-letter.dto";
import { Letters } from "../entity/letters.entity";

@Controller('letters')
export class LettersController {
  constructor(
    @Inject(MailService) private readonly mailService: MailService,
    private readonly letterService: LetterService,
    @Inject(UsersService) private readonly usersService: UsersService
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


  @Post()
  async createLetter(@Body() dto: CreateLetterDto) {
    return await this.letterService.createLetter(dto);
  }
}
