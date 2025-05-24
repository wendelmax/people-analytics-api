import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePerformanceInput } from './create-performance.input';

@InputType()
export class UpdatePerformanceInput extends PartialType(CreatePerformanceInput) {}
