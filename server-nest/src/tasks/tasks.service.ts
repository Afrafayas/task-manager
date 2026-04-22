import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async getAllTasks(userId: string, workspaceId?: string) {
    const query = workspaceId
      ? { workspace: new Types.ObjectId(workspaceId) }
      : { user: new Types.ObjectId(userId), workspace: null };

    return this.taskModel
      .find(query)
      .populate('assignedTo', 'name email')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  }

  async createTask(userId: string, createTaskDto: CreateTaskDto) {
    const { workspaceId, assignedTo, ...rest } = createTaskDto;

    const task = new this.taskModel({
      ...rest,
      user: new Types.ObjectId(userId),
      workspace: workspaceId ? new Types.ObjectId(workspaceId) : null,
      assignedTo: assignedTo ? new Types.ObjectId(assignedTo) : null,
    });

    await task.save();

    return this.taskModel
      .findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('user', 'name email');
  }

  async updateTask(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      $or: [
        { user: new Types.ObjectId(userId) },
        { assignedTo: new Types.ObjectId(userId) },
      ],
    });

    if (!task) throw new NotFoundException('Task not found');

    return this.taskModel
      .findByIdAndUpdate(taskId, updateTaskDto, { new: true })
      .populate('assignedTo', 'name email')
      .populate('user', 'name email');
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      user: new Types.ObjectId(userId),
    });

    if (!task) throw new NotFoundException('Task not found');

    await this.taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
  }
}