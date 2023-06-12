import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  otchestvo: string;

  @IsEmail()
  email: string;

  @IsString()
  country: string;
}

