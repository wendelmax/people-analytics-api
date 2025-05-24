import { Resolver } from '@nestjs/graphql';

@Resolver()
export abstract class BaseResolver {
  protected abstract readonly useCase: any;
}
