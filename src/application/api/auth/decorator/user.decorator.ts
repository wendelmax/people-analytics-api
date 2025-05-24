import { HttpRequestWithUser, HttpUserPayload } from '@application/api/auth/type/auth.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): HttpUserPayload => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
