// src/mail/mail.service.ts
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "@prisma/client";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.api_url}/api/auth/activate/${user.activation_link}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Backend-API!",
      template: "confirmation",
      context: {
        username: user.fullName,
        url,
      },
    });
  }
  async sendResetPasswordEmail(email: string, otp: string) {
    
    await this.mailerService.sendMail({
      to: email,
      subject: "Password Reset Request",
      template: "./resetPassword",
      context: {
        otp: otp,
      },
    });
  }
}
