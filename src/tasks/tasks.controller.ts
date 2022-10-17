import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskDto } from './task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('users/:userId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
  })
  @ApiResponse({ status: 422, description: 'User not found' })
  create(@Param('userId') userId: number, @Body() createTask: TaskDto) {
    createTask.userId = userId;
    return this.tasksService.create(createTask);
  }

  @Get()
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 422, description: 'User not found' })
  findAll(@Param('userId') userId: number) {
    return this.tasksService.findAll(userId);
  }

  @Put(':id')
  @ApiResponse({ status: 422, description: 'User not found' })
  update(
    @Param('userId') userId: number,
    @Param('id') id: number,
    @Body() updateTask: TaskDto,
  ) {
    updateTask.userId = userId;
    updateTask.id = id;
    return this.tasksService.update(updateTask);
  }

  @Delete(':id')
  @ApiResponse({ status: 422, description: 'User not found' })
  delete(@Param('userId') userId: number, @Param('id') id: number) {
    return this.tasksService.delete(userId, id);
  }
}
