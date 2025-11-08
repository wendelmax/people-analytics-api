import { Module } from '@nestjs/common';
import { EmployeeResolver } from '@application/graphql/resolvers/employee.resolver';
import { ServicesModule } from '@core/domain/services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [EmployeeResolver],
})
export class ResolversModule {}
