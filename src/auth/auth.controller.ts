import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Res,
  Req,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SigninUserDto } from "../users/dto/signin-user.dto";
import { Request, Response } from "express";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { AuthGuard } from "../common/guards/jwt-auth.guard";
import { UpdateMeDto } from "../users/dto/update-me.dto";
import { ForgotPasswordDto } from "../users/dto/forgot-password.dto";
import { ResetPasswordDto } from "../users/dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(200)
  @Post("signin")
  signin(
    @Body() signinUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signin(signinUserDto, res);
  }

  @Get("activate/:link")
  async activate(@Param("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post("logout")
  logout(
    @CookieGetter("refreshToken") refeshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refeshToken, res);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res);
  }
  @UseGuards(AuthGuard)
  @Get("me")
  me(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.authService.getMe(userId);
  }

  @UseGuards(AuthGuard)
  @Patch("me")
  updateMe(@Body() updateMeDto: UpdateMeDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.authService.updateMe(userId, updateMeDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post("reset-password")
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user.id;
    return this.authService.resetPassword(userId, resetPasswordDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post("confirm-password")
  resetForgotPassword(
    @Body("otpCode") otpCode: string,
    @Body("newPassword") newPassword: string,
    @Body("confirmPassword") confirmPassword: string
  ) {
    return this.authService.resetForgotPassword(
      otpCode,
      newPassword,
      confirmPassword
    );
  }
}
