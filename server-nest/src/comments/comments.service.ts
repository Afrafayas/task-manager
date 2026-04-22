import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { Task, TaskDocument } from '../tasks/task.schema';
import { Workspace, WorkspaceDocument } from '../workspace/workspace.schema';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
  ) {}

  private async checkAccess(taskId: string, userId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const isOwner = task.user.toString() === userId;
    const isAssigned = task.assignedTo?.toString() === userId;

    if (task.workspace) {
      const ws = await this.workspaceModel.findOne({
        _id: task.workspace,
        'members.user': new Types.ObjectId(userId),
      });
      if (!ws && !isOwner && !isAssigned)
        throw new ForbiddenException('Access denied');
    } else if (!isOwner && !isAssigned) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async getComments(taskId: string, userId: string) {
    await this.checkAccess(taskId, userId);
    return this.commentModel
      .find({ task: new Types.ObjectId(taskId) })
      .populate('user', 'name email')
      .populate('replies.user', 'name email')
      .sort({ createdAt: -1 });
  }

  async createComment(taskId: string, userId: string, createCommentDto: CreateCommentDto) {
    const task = await this.checkAccess(taskId, userId);

    const comment = new this.commentModel({
      text: createCommentDto.text,
      task: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
      workspace: task.workspace || null,
    });
    await comment.save();

    return this.commentModel
      .findById(comment._id)
      .populate('user', 'name email')
      .populate('replies.user', 'name email');
  }

  async deleteComment(taskId: string, commentId: string, userId: string) {
    const comment = await this.commentModel.findOne({
      _id: commentId,
      user: new Types.ObjectId(userId),
    });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.commentModel.findByIdAndDelete(commentId);
    return { message: 'Comment deleted successfully' };
  }

  async addReply(taskId: string, commentId: string, userId: string, createReplyDto: CreateReplyDto) {
    await this.checkAccess(taskId, userId);
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    comment.replies.push({
      text: createReplyDto.text,
      user: new Types.ObjectId(userId) as any,
    });
    await comment.save();

    return this.commentModel
      .findById(comment._id)
      .populate('user', 'name email')
      .populate('replies.user', 'name email');
  }

  async deleteReply(commentId: string, replyId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    comment.replies = comment.replies.filter(
      (r: any) => r._id.toString() !== replyId || r.user.toString() !== userId
    );
    await comment.save();
    return { message: 'Reply deleted successfully' };
  }
}