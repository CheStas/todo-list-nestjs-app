import { ApiProperty, PartialType } from '@nestjs/swagger';

class TaskFullDto {
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({
    required: false,
    default: false,
  })
  isDone: boolean;
  userId?: number;
  id?: number;
}

export class TaskDto extends PartialType(TaskFullDto) {}
