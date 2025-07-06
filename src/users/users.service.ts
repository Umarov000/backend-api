import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { roles, User } from "@prisma/client";
import { CreateAdminDto } from "./dto/create-admin.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, confirm_password } = createUserDto;
    if (password !== confirm_password) {
      throw new BadRequestException("Passwords do not match.");
    }
    const hashed_password = await bcrypt.hash(password, 7);

    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        password: hashed_password,
        role: roles.user,
      },
    });
    return newUser;
  }
  async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.prisma.user.findUnique({
      where: { email: createAdminDto.email },
    });
    if (admin) {
      throw new ConflictException("Admin already exists");
    }

    const { password, confirm_password } = createAdminDto;
    if (password !== confirm_password) {
      throw new BadRequestException("Passwords do not match.");
    }
    const hashed_password = await bcrypt.hash(password, 7);

    const newUser = await this.prisma.user.create({
      data: {
        email: createAdminDto.email,
        fullName: createAdminDto.fullName,
        isCreator: createAdminDto.isCreator,
        password: hashed_password,
        role: roles.admin,
        isActive: true,
      },
    });
    return newUser;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: {
        task: {
          select: { id: true, title: true, description: true, deadline: true },
        },
      },
    });
  }

  async findOne(id: number, all?: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`User with id ${id} not found`);

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`User with id ${id} not found`);

    await this.prisma.user.delete({
      where: { id },
    });
    return { message: `User deleted successfylly.` };
  }
  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
  async updateRefreshToken(id: number, refresh_token: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { refresh_token },
    });

    return updatedUser;
  }
  async findByActivationLink(link: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { activation_link: link } });
  }
}
