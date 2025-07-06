import { roles } from "@prisma/client";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateAdminDto {
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

  @IsOptional()
  @IsString()
  role: roles;

  @IsOptional()
  @IsBoolean()
  isCreator: boolean;
}
