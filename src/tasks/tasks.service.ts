import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './task.model';
// import { v1 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  //   private tasks: Task[] = [];
  //   getAllTasks(): Task[] {
  //     return this.tasks;
  //   }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  //   getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //     const { status, search } = filterDto;
  //     let tasks = this.getAllTasks();
  //     if (status) {
  //       tasks = tasks.filter((task) => task.status === status);
  //     }
  //     if (search) {
  //       tasks = tasks.filter(
  //         (task) =>
  //           task.title.includes(search) || task.description.includes(search),
  //       );
  //     }
  //     return tasks;
  //   }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }

  //   getTaskById(id: string): Task {
  //     const found = this.tasks.find((task) => task.id === id);
  //     if (!found) {
  //       throw new NotFoundException(`Task with id: ${id} not found`);
  //     }
  //     return found;
  //   }

  //   //   createTask(title: string, description: string): Task {
  //   //     const task: Task = {
  //   //       id: uuidv4(),
  //   //       title,
  //   //       description,
  //   //       status: TaskStatus.OPEN,
  //   //     };

  //   createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;
  //     const task: Task = {
  //       id: uuidv4(),
  //       title,
  //       description,
  //       status: TaskStatus.OPEN,
  //     };
  //     this.tasks.push(task);
  //     return task;
  //   }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
    // const { title, description } = createTaskDto;
    // const task = new Task();
    // task.title = title;
    // task.description = description;
    // task.status = TaskStatus.OPEN;
    // await task.save();

    // return task;
  }

  //   updateTaskStatus(id: string, status: TaskStatus): Task {
  //     const task: Task = this.getTaskById(id);
  //     task.status = status;
  //     return task;
  //   }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task: Task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  //   deleteTaskById(id: string): void {
  //     const found: Task = this.getTaskById(id);
  //     this.tasks = this.tasks.filter((task) => task.id !== found.id);
  //   }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }
}
