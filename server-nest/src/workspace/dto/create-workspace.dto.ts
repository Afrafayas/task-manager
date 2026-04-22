import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;
}

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(['admin', 'member'])
  role?: string;
}