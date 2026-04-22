import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getComments(@Param('taskId') taskId: string, @Request() req) {
    return this.commentsService.getComments(taskId, req.user.id);
  }

  @Post()
  createComment(
    @Param('taskId') taskId: string,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(taskId, req.user.id, createCommentDto);
  }

  @Delete(':commentId')
  deleteComment(
    @Param('taskId') taskId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.commentsService.deleteComment(taskId, commentId, req.user.id);
  }

  @Post(':commentId/replies')
  addReply(
    @Param('taskId') taskId: string,
    @Param('commentId') commentId: string,
    @Request() req,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.commentsService.addReply(taskId, commentId, req.user.id, createReplyDto);
  }

  @Delete(':commentId/replies/:replyId')
  deleteReply(
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Request() req,
  ) {
    return this.commentsService.deleteReply(commentId, replyId, req.user.id);
  }
}