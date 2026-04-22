import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace, WorkspaceDocument } from './workspace.schema';
import { User, UserDocument } from '../auth/user.schema';
import { CreateWorkspaceDto, InviteMemberDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createWorkspace(userId: string, createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = new this.workspaceModel({
      name: createWorkspaceDto.name,
      owner: new Types.ObjectId(userId),
      members: [{ user: new Types.ObjectId(userId), role: 'admin' }],
    });
    await workspace.save();
    return this.workspaceModel
      .findById(workspace._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
  }

  async getWorkspaces(userId: string) {
    return this.workspaceModel
      .find({ 'members.user': new Types.ObjectId(userId) })
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
  }

  async inviteMember(userId: string, workspaceId: string, inviteMemberDto: InviteMemberDto) {
    const workspace = await this.workspaceModel.findOne({
      _id: workspaceId,
      owner: new Types.ObjectId(userId),
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const user = await this.userModel.findOne({ email: inviteMemberDto.email });
    if (!user) throw new NotFoundException('User not found');

    const isMember = workspace.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (isMember) throw new BadRequestException('User already a member');

    workspace.members.push({
      user: user._id as Types.ObjectId,
      role: inviteMemberDto.role || 'member',
    });
    await workspace.save();

    return this.workspaceModel
      .findById(workspace._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
  }

  async removeMember(userId: string, workspaceId: string, memberId: string) {
    const workspace = await this.workspaceModel.findOne({
      _id: workspaceId,
      owner: new Types.ObjectId(userId),
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== memberId
    );
    await workspace.save();
    return { message: 'Member removed successfully' };
  }
}