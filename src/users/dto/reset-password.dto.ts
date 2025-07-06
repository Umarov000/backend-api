import { IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  oldPassword: string;
  @IsStrongPassword(
    { minLength: 6, minSymbols: 0, minUppercase: 0 },
    { message: "Parol yetarlicha mustahkam emas" }
  )
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
