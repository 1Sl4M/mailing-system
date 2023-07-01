import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../entity/users.entity";
import { Letters } from "../entity/letters.entity";
import { Groups } from "../entity/groups.entity";
import { Spam } from "../entity/spam.entity";
import { SentUsers } from "../entity/sent_users.entity";
import { Country } from "../entity/country.entity";
import { City } from "../entity/city.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Letters, Groups, Spam, SentUsers, Country, City])
  ],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
