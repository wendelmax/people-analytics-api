import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { KnowledgeBase } from '../types/knowledge-base.type';
import { KnowledgeBaseService } from '@core/domain/services/knowledge-base.service';
import { CreateKnowledgeBaseInput } from '../inputs/create-knowledge-base.input';
import { UpdateKnowledgeBaseInput } from '../inputs/update-knowledge-base.input';

@Resolver(() => KnowledgeBase)
export class KnowledgeBaseResolver {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Query(() => [KnowledgeBase])
  async knowledgeBases(): Promise<KnowledgeBase[]> {
    return this.knowledgeBaseService.findAll();
  }

  @Query(() => KnowledgeBase)
  async knowledgeBase(@Args('id', { type: () => ID }) id: string): Promise<KnowledgeBase> {
    return this.knowledgeBaseService.findById(id);
  }

  @Query(() => [KnowledgeBase])
  async employeeKnowledgeBases(
    @Args('employeeId', { type: () => ID }) employeeId: string,
  ): Promise<KnowledgeBase[]> {
    return this.knowledgeBaseService.findByEmployeeId(employeeId);
  }

  @Mutation(() => KnowledgeBase)
  async createKnowledgeBase(
    @Args('createKnowledgeBaseInput') createKnowledgeBaseInput: CreateKnowledgeBaseInput,
  ): Promise<KnowledgeBase> {
    return this.knowledgeBaseService.create(createKnowledgeBaseInput);
  }

  @Mutation(() => KnowledgeBase)
  async updateKnowledgeBase(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateKnowledgeBaseInput') updateKnowledgeBaseInput: UpdateKnowledgeBaseInput,
  ): Promise<KnowledgeBase> {
    return this.knowledgeBaseService.update(id, updateKnowledgeBaseInput);
  }

  @Mutation(() => KnowledgeBase)
  async deleteKnowledgeBase(@Args('id', { type: () => ID }) id: string): Promise<KnowledgeBase> {
    return this.knowledgeBaseService.delete(id);
  }
}
