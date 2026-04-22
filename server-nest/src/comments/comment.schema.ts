import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  task: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', default: null })
  workspace: Types.ObjectId;

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);