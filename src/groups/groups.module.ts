import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../entity/users.entity";
import { Groups } from "../entity/groups.entity";
import { Letters } from "../entity/letters.entity";
import { Spam } from "../entity/spam.entity";
import { SentUsers } from "../entity/sent_users.entity";
import { Country } from "../entity/country.entity";
import { City } from "../entity/city.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Groups, Letters, Spam, SentUsers, Country, City])
  ],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
