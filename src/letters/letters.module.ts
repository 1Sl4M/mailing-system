import { Module } from '@nestjs/common';
import { LettersService } from './letters.service';
import { LettersController } from './letters.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letters } from "../entity/letters.entity";
import { Users } from "../entity/users.entity";
import { MailService } from "./mail.service";
import { UsersService } from "../users/users.service";
import { Groups } from "../entity/groups.entity";
import { GroupsService } from "../groups/groups.service";
import { ConfigModule } from "@nestjs/config";
import { Spam } from "../entity/spam.entity";
import { SentUsers } from "../entity/sent_users.entity";
import { Country } from "../entity/country.entity";
import { City } from "../entity/city.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Letters, Groups, Spam, SentUsers, Country, City])
  ],
  controllers: [LettersController],
  providers: [LettersService, MailService, UsersService, GroupsService]
})
export class LettersModule {}
