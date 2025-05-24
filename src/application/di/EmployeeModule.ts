import { Module } from '@nestjs/common';
import { EmployeeController } from '@application/api/controller/EmployeeController';
import { EmployeeService } from '@application/api/service/EmployeeService';
import { EmployeeRepository } from '@infrastructure/repository/EmployeeRepository';
import { EmployeeResolver } from '@application/api/graphql/resolvers/employee.resolver';

@Module({
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    EmployeeResolver,
    {
      provide: 'EmployeeRepository',
      useClass: EmployeeRepository,
    },
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
