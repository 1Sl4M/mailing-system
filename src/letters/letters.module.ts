import { Module } from '@nestjs/common';
import { LetterService } from './letter.service';
import { LettersController } from './letters.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letters } from "../entity/letters.entity";
import { Users } from "../entity/users.entity";
import { MailService } from "../users/mail.service";
import { UsersService } from "../users/users.service";
import { Groups } from "../entity/groups.entity";
import { GroupsService } from "../groups/groups.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Letters, Groups])
  ],
  controllers: [LettersController],
  providers: [LetterService, MailService, UsersService, GroupsService]
})
export class LettersModule {}
