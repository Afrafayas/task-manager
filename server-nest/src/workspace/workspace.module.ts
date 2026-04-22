import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { Workspace, WorkspaceSchema } from './workspace.schema';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [MongooseModule],
})
export class WorkspaceModule {}