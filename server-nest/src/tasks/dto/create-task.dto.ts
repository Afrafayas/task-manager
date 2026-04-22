import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['Pending', 'In Progress', 'Completed'])
  status?: string;

  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  priority?: string;

  @IsOptional()
  @IsMongoId()
  workspaceId?: string;

  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['Pending', 'In Progress', 'Completed'])
  status?: string;

  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  priority?: string;

  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}   