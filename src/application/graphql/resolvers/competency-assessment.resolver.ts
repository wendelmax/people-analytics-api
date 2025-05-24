import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CompetencyAssessment } from '../types/competency-assessment.type';
import { CompetencyAssessmentService } from '@core/domain/services/competency-assessment.service';
import { CreateCompetencyAssessmentInput } from '../inputs/create-competency-assessment.input';
import { UpdateCompetencyAssessmentInput } from '../inputs/update-competency-assessment.input';

@Resolver(() => CompetencyAssessment)
export class CompetencyAssessmentResolver {
  constructor(private readonly competencyAssessmentService: CompetencyAssessmentService) {}

  @Query(() => [CompetencyAssessment])
  async competencyAssessments(): Promise<CompetencyAssessment[]> {
    return this.competencyAssessmentService.findAll();
  }

  @Query(() => CompetencyAssessment)
  async competencyAssessment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CompetencyAssessment> {
    return this.competencyAssessmentService.findById(id);
  }

  @Query(() => [CompetencyAssessment])
  async employeeCompetencyAssessments(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<CompetencyAssessment[]> {
    return this.competencyAssessmentService.findByEmployeeId(employeeId);
  }

  @Mutation(() => CompetencyAssessment)
  async createCompetencyAssessment(
    @Args('createCompetencyAssessmentInput')
    createCompetencyAssessmentInput: CreateCompetencyAssessmentInput,
  ): Promise<CompetencyAssessment> {
    return this.competencyAssessmentService.create(createCompetencyAssessmentInput);
  }

  @Mutation(() => CompetencyAssessment)
  async updateCompetencyAssessment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCompetencyAssessmentInput')
    updateCompetencyAssessmentInput: UpdateCompetencyAssessmentInput,
  ): Promise<CompetencyAssessment> {
    return this.competencyAssessmentService.update(id, updateCompetencyAssessmentInput);
  }

  @Mutation(() => CompetencyAssessment)
  async deleteCompetencyAssessment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CompetencyAssessment> {
    return this.competencyAssessmentService.delete(id);
  }
}
