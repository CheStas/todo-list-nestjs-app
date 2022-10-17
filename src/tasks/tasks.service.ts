import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const task = await this.taskModel.create({
      ...taskDto,
      user: new Types.ObjectId(user._id),
    });
    user.tasks.push(task);
    await user.save();
    return {
      id: task.id,
      name: task.name,
      isDone: task.isDone,
    };
  }

  async findAll(userId: number) {
    const user = await this.userModel
      .findOne({ id: userId, select: ['id', 'name', 'tasks'] })
      .populate({
        path: 'tasks',
        select: { _id: 0, id: 1, name: 1, isDone: 1 },
      })
      .select({ _id: 0, id: 1, name: 1, tasks: 1 })
      .exec();

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  async update(taskDto: TaskDto) {
    const user = await this.userModel.findOne({ id: taskDto.userId });

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const task = await this.taskModel.findOne({ id: taskDto.id, user });

    if (!task) {
      throw new HttpException(
        'Task not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (taskDto.hasOwnProperty('name')) {
      task.name = taskDto.name;
    }
    if (taskDto.hasOwnProperty('isDone')) {
      task.isDone = taskDto.isDone;
    }

    await task.save();
    return {
      id: task.id,
      name: task.name,
      isDone: task.isDone,
    };
  }

  async delete(userId: number, id: number) {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return this.taskModel.deleteOne({ id, user });
  }
}
