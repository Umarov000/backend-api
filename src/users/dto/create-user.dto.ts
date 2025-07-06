import { roles } from "@prisma/client";
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    { minLength: 6, minSymbols: 0, minUppercase: 0 },
    { message: "Parol yetarlicha mustahkam emas" }
  )
  password: string;
  confirm_password: string;

}
