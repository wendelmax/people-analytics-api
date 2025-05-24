import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMentoringInput } from './create-mentoring.input';

@InputType()
export class UpdateMentoringInput extends PartialType(CreateMentoringInput) {}
