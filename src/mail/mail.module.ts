// src/mail/mail.module.ts
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./mail.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>("smtp_host"),
          port: 587,
          secure: false,
          auth: {
            user: config.get<string>("smtp_user"),
            pass: config.get<string>("smtp_password"),
          },
        },
        defaults: {
          from: `"Backend-API" <${config.get("smtp_user")}>`,
        },
        template: {
          dir: join(process.cwd(), "src", "mail", "templates"), // ✅ to‘g‘ri build yo‘li
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
