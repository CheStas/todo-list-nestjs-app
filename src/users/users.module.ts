import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (connection: Connection) => {
          const schema = UserSchema;
          const AutoIncrement: any = AutoIncrementFactory(connection as any);
          schema.plugin(AutoIncrement, {
            id: 'user_id_counter',
            inc_field: 'id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [MongooseModule],
})
export class UsersModule {}
