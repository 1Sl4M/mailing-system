import { IsDate, IsString, MinLength } from "class-validator";

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;
}
