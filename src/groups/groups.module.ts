import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../entity/users.entity";
import { Groups } from "../entity/groups.entity";
import { Letters } from "../entity/letters.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Groups, Letters])
  ],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
