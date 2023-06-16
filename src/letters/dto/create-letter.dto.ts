import { IsEmail, IsString } from "class-validator";

export class CreateLetterDto {
  @IsString()
  theme: string;

  @IsString()
  content: string;
}
