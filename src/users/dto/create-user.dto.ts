import { IsString, IsEmail, MinLength, IsDate, Matches } from "class-validator";
import { Unique } from "typeorm";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  email: string;

  @IsString()
  city: string;

  country_id: number
}

