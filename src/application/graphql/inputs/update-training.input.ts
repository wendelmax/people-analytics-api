import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTrainingInput } from './create-training.input';

@InputType()
export class UpdateTrainingInput extends PartialType(CreateTrainingInput) {}
