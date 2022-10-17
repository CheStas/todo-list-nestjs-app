import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const createTaskSuccessRes = {
    name: 'name',
    isDone: false,
    id: 0,
  };
  const findAllTasksRes = {
    tasks: [],
  };
  const deleteTaskRes = {
    acknowledged: true,
    deletedCount: 1,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue(createTaskSuccessRes),
            findAll: jest.fn().mockResolvedValue(findAllTasksRes),
            update: jest.fn().mockResolvedValue(createTaskSuccessRes),
            delete: jest.fn().mockResolvedValue(deleteTaskRes),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create task', async () => {
      expect(await controller.create(0, {})).toBe(createTaskSuccessRes);
    });
  });
  describe('findAll', () => {
    it('should return all tasks for user', async () => {
      expect(await controller.findAll(0)).toBe(findAllTasksRes);
    });
  });
  describe('update', () => {
    it('should update task', async () => {
      expect(await controller.update(0, 0, {})).toBe(createTaskSuccessRes);
    });
  });
  describe('delete', () => {
    it('should delete task', async () => {
      expect(await controller.delete(0, 0)).toBe(deleteTaskRes);
    });
  });
});
