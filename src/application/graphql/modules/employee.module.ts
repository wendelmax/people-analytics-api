import { Module } from '@nestjs/common';
import { EmployeeResolver } from '../resolvers/employee.resolver';
import { EmployeeService } from '@core/domain/services/employee.service';
import { PrismaModule } from '@infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeResolver, EmployeeService],
  exports: [EmployeeResolver, EmployeeService],
})
export class EmployeeModule {}
