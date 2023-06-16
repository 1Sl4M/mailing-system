import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateLetterDto {
  @IsString()
  @MinLength(3)
  theme: string;

  @IsString()
  @MinLength(5)
  content: string;
}
