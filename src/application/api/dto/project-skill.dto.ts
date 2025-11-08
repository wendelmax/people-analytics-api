import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProjectSkillDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsUUID()
  skillId: string;
}
