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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Letters, Groups]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService, GroupsService],
  exports: [UsersService, MailService]
})
export class UsersModule {}
