import { IsString, IsEmail, MinLength, IsDate } from "class-validator";
import { Unique } from "typeorm";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  city: string;

  country_id: number
}

