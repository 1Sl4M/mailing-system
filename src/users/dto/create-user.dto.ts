import { IsString, IsEmail, MinLength, IsDate } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsString()
  @MinLength(3)
  otchestvo: string;

  @IsEmail()
  email: string;
}

