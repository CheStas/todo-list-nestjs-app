import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Task.name,
        useFactory: async (connection: Connection) => {
          const schema = TaskSchema;
          const AutoIncrement: any = AutoIncrementFactory(connection as any);
          schema.plugin(AutoIncrement, {
            id: 'task_id_counter',
            inc_field: 'id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    UsersModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [MongooseModule],
})
export class TasksModule {}
