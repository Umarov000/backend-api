import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as bcrypt from "bcrypt";
import { PrismaService } from "./prisma/prisma.service";
import * as chalk from "chalk";
import { roles } from "@prisma/client";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function createSuperAdmin(prisma: PrismaService) {
  const hashed = await bcrypt.hash("Secure123!", 7);

  const admin = await prisma.user.findFirst({
    where: {
      email: "exmpleAdmin@gmail.com",
    },
  });

  if (admin) {
    console.log(chalk.greenBright("\n✅ Super Admin already exists!\n"));

    return;
  }

  await prisma.user.create({
    data: {
      email: "exmpleAdmin@gmail.com",
      fullName: "Super Admin Test",
      password: hashed,
      role: roles.admin,
      isCreator: true,
      isActive: true,
    },
  });

  console.log(chalk.greenBright("\n✅ Super Admin created successfully!\n"));
}

async function start() {
  try {
    const PORT = process.env.PORT ?? 3030;
    const app = await NestFactory.create(AppModule);
    const prisma = app.get(PrismaService);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");
    const config = new DocumentBuilder()
      .setTitle("Backend-API")
      .setDescription("NestJS RESTful API")
      .setVersion("1.0")
      .addTag(
        "NestJS, AccessToken,RefreshToken, Cookie, SMS, BOT, Validation, Auth"
      )
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    await createSuperAdmin(prisma);

    await app.listen(PORT);
    console.log(`\nServer started at: http://localhost:${PORT}\n`);
  } catch (error) {
    console.log(chalk.red("\n❌ Error starting application:"), error);
  }
}

start();
