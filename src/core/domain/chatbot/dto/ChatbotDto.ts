import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsObject, IsEnum } from 'class-validator';

export class ChatbotInteractionDto {
  @ApiProperty({ description: 'User ID interacting with the chatbot' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Message sent by the user' })
  @IsString()
  message: string;
}

export class ChatbotContextPreferencesDto {
  @ApiPropertyOptional({ enum: ['basic', 'detailed', 'technical'], description: 'Level of detail for the response' })
  @IsOptional()
  @IsEnum(['basic', 'detailed', 'technical'])
  detailLevel?: 'basic' | 'detailed' | 'technical';
}

export class ChatbotContextDto {
  @ApiProperty({ description: 'User ID for context' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ type: ChatbotContextPreferencesDto, description: 'User preferences for the response' })
  @IsOptional()
  @IsObject()
  preferences?: ChatbotContextPreferencesDto;
}

export class ChatbotTrainingDto {
  @ApiProperty({ description: 'Training data for the chatbot' })
  @IsString()
  data: string;

  @ApiPropertyOptional({ description: 'Type of training data' })
  @IsOptional()
  @IsString()
  type?: string;
}

export class ChatbotFeedbackDto {
  @ApiProperty({ description: 'User ID providing feedback' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Feedback message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Rating for the chatbot response' })
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'Interaction ID related to this feedback' })
  @IsOptional()
  @IsUUID()
  interactionId?: string;
}

export class CreateChatbotDto {
  @ApiProperty({ description: 'User ID interacting with the chatbot' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Message sent by the user' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Response from the chatbot' })
  @IsOptional()
  @IsString()
  response?: string;

  @ApiPropertyOptional({ description: 'Context of the conversation' })
  @IsOptional()
  @IsString()
  context?: string;
}

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {}

