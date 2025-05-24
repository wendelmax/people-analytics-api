import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Skill } from '../types/skill.type';
import { SkillService } from '@core/domain/services/skill.service';
import { CreateSkillInput } from '../inputs/create-skill.input';
import { UpdateSkillInput } from '../inputs/update-skill.input';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Query(() => [Skill])
  async skills(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @Query(() => Skill)
  async skill(@Args('id', { type: () => ID }) id: string): Promise<Skill> {
    return this.skillService.findById(id);
  }

  @Mutation(() => Skill)
  async createSkill(@Args('createSkillInput') createSkillInput: CreateSkillInput): Promise<Skill> {
    return this.skillService.create(createSkillInput);
  }

  @Mutation(() => Skill)
  async updateSkill(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateSkillInput') updateSkillInput: UpdateSkillInput,
  ): Promise<Skill> {
    return this.skillService.update(id, updateSkillInput);
  }

  @Mutation(() => Skill)
  async deleteSkill(@Args('id', { type: () => ID }) id: string): Promise<Skill> {
    return this.skillService.delete(id);
  }
}
