import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { TaskDto } from './task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(taskDto: TaskDto) {
    const user = await this.userModel.findOne({ id: taskDto.userId });
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    const task = await this.taskModel.create({
      ...taskDto,
      user: new Types.ObjectId(user._id),
    });
    user.tasks.push(task);
    await user.save();
    return task;
  }

  async findAll(userId: number) {
    return await this.userModel
      .findOne({ id: userId, select: ['id', 'name', 'tasks'] })
      .populate({ path: 'tasks', select: ['id', 'name', 'isDone'] })
      .exec();
  }

  async update(taskDto: TaskDto) {
    const user = await this.userModel.findOne({ id: taskDto.userId });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    const task = await this.taskModel.findOne({ id: taskDto.id, user });

    if (!task) {
      throw new NotFoundException({
        message: 'Task not found',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    if (taskDto.hasOwnProperty('name')) {
      task.name = taskDto.name;
    }
    if (taskDto.hasOwnProperty('isDone')) {
      task.isDone = taskDto.isDone;
    }

    return task.save();
  }

  async delete(userId: number, id: number) {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    return this.taskModel.deleteOne({ id, user });
  }
}
