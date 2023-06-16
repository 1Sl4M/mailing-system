import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from "../entity/users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letters } from "../entity/letters.entity";
import { MailService } from "./mail.service";
import { Groups } from "../entity/groups.entity";
import { GroupsService } from "../groups/groups.service";
import { ConfigModule } from "@nestjs/config";
import { Spam } from "../entity/spam.entity";
import { SentUsers } from "../entity/sent_users.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Letters, Groups, Spam, SentUsers]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService, GroupsService],
  exports: [UsersService, MailService]
})
export class UsersModule {}
