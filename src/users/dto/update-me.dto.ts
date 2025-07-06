import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateMeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName?: string;

  @IsEmail()
  email?: string;
}
