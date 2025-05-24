import { JwtAuthGuard } from '@application/api/auth/guard/jwt-auth.guard';
import { UserRole } from '@core/common/enums/UserEnums';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthDecorator = (...roles: UserRole[]): ((...args: any) => void) => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard));
};
