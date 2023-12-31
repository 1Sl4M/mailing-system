import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from "./entity/users.entity";
import { Groups } from "./entity/groups.entity";
import { Spam } from "./entity/spam.entity";
import { Letters } from "./entity/letters.entity";
import { SentUsers } from "./entity/sent_users.entity";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { LettersModule } from './letters/letters.module';
import { GroupsModule } from './groups/groups.module';
import { Country } from "./entity/country.entity";
import { City } from "./entity/city.entity";
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DATABASE,
      entities: [Users, Groups, Spam, Letters, SentUsers, Country, City],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Users, Letters, Groups, Spam, SentUsers, Country, City]),
    UsersModule,
    LettersModule,
    GroupsModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}