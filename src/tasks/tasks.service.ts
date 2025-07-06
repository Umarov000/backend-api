import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { statuses } from "@prisma/client";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        status: statuses.pending,
      },
    });
    return task;
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
  async getOwnTasks(userId: number) {
    const ownTasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!ownTasks.length) {
      throw new NotFoundException(`Sizda task mavjud emas.`);
    }

    return ownTasks;
  }
}
