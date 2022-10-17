import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Task } from 'src/tasks/task.schema';

@Schema()
export class User {
  @Prop({ required: false })
  name?: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }])
  tasks: Array<Task>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
