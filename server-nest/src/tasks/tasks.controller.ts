import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /api/tasks?workspaceId=...
  @Get()
  getAllTasks(@Request() req, @Query('workspaceId') workspaceId?: string) {
    return this.tasksService.getAllTasks(req.user.id, workspaceId);
  }

  // POST /api/tasks
  @Post()
  createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(req.user.id, createTaskDto);
  }

  // PUT /api/tasks/:id
  @Put(':id')
  updateTask(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(req.user.id, id, updateTaskDto);
  }

  // DELETE /api/tasks/:id
  @Delete(':id')
  deleteTask(@Request() req, @Param('id') id: string) {
    return this.tasksService.deleteTask(req.user.id, id);
  }
}