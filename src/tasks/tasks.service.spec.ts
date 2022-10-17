import { HttpStatus, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { Task, TaskDocument } from './task.schema';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let mockUserModel: Model<UserDocument>;
  let mockTaskModel: Model<TaskDocument>;
  const userNotFoundExpection = new NotFoundException({
    message: 'User not found',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
  const taskNotFoundExpection = new NotFoundException({
    message: 'Task not found',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
  const createTaskSuccessRes = {
    name: 'name',
    isDone: false,
    id: 0,
    save: jest.fn().mockImplementation(() => createTaskSuccessRes),
  };
  const findUserSuccessRes = {
    name: 'name',
    id: 0,
    tasks: [],
    save: jest.fn(),
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockImplementation(() => findUserSuccessRes),
    })),
  };
  const deleteTaskRes = {
    acknowledged: true,
    deletedCount: 1,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockImplementation(() => findUserSuccessRes),
          },
        },
        {
          provide: getModelToken(Task.name),
          useValue: {
            create: jest.fn().mockImplementation(() => createTaskSuccessRes),
            findOne: jest.fn().mockImplementation(() => createTaskSuccessRes),
            deleteOne: jest.fn().mockImplementation(() => deleteTaskRes),
          },
        },
        TasksService,
      ],
    }).compile();

    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    mockTaskModel = module.get<Model<TaskDocument>>(getModelToken(Task.name));
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create new task for user', async () => {
      expect(await service.create({})).toBe(createTaskSuccessRes);
    });
    it('should throw error', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementationOnce(() => null);
      try {
        await service.create({});
      } catch (e) {
        expect(e).toEqual(userNotFoundExpection);
      }
    });
  });
  describe('findAll', () => {
    it('should return all tasks for user', async () => {
      expect(await service.findAll(0)).toBe(findUserSuccessRes);
    });
  });
  describe('update', () => {
    it('should update task', async () => {
      expect(
        await service.update({
          name: 'updatedName',
          isDone: true,
        }),
      ).toBe(createTaskSuccessRes);
    });
    it('should throw error if user does not exist', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementationOnce(() => null);
      try {
        await service.update({});
      } catch (e) {
        expect(e).toEqual(userNotFoundExpection);
      }
    });
    it('should throw error if task does not exist', async () => {
      jest.spyOn(mockTaskModel, 'findOne').mockImplementationOnce(() => null);
      try {
        await service.update({});
      } catch (e) {
        expect(e).toEqual(taskNotFoundExpection);
      }
    });
  });
  describe('delete', () => {
    it('should delete task', async () => {
      expect(await service.delete(0, 0)).toBe(deleteTaskRes);
    });
    it('should throw error', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementationOnce(() => null);
      try {
        await service.delete(0, 0);
      } catch (e) {
        expect(e).toEqual(userNotFoundExpection);
      }
    });
  });
});
