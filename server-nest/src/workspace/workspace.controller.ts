import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto, InviteMemberDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspace')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // POST /api/workspace
  @Post()
  createWorkspace(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(req.user.id, createWorkspaceDto);
  }

  // GET /api/workspace
  @Get()
  getWorkspaces(@Request() req) {
    return this.workspaceService.getWorkspaces(req.user.id);
  }

  // POST /api/workspace/:id/invite
  @Post(':id/invite')
  inviteMember(
    @Request() req,
    @Param('id') id: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.workspaceService.inviteMember(req.user.id, id, inviteMemberDto);
  }

  // DELETE /api/workspace/:id/members/:userId
  @Delete(':id/members/:userId')
  removeMember(
    @Request() req,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.workspaceService.removeMember(req.user.id, id, userId);
  }
}