import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "./entity/city.entity";
import { Repository } from "typeorm";
import { Country } from "./entity/country.entity";
import { Users } from "./entity/users.entity";

@Injectable()
export class AppService {}
