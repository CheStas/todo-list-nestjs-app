import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserDocument } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(User),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create new user, empty body', async () => {
      const response: any = {
        id: 1,
        name: 'name',
      };
      jest
        .spyOn(mockUserModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(response));

      expect(await service.create({})).toMatchObject(response);
    });

    it('should create new user with name', async () => {
      const userData: any = {
        id: 1,
        name: 'name',
      };

      jest
        .spyOn(mockUserModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(userData));

      expect(await service.create({ name: 'name' })).toMatchObject(userData);
    });
  });
});
