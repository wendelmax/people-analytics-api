import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@core/common/enums/UserEnums';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { HttpRequestWithUser, HttpJwtPayload } from '../type/auth.types';
import { verify, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HttpRequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw Exception.new({ code: Code.UNAUTHORIZED_ERROR });
    }

    const payload = this.verifyToken(token);
    request.user = payload;

    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];

    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(payload.role);
      if (!hasRole) {
        throw Exception.new({ code: Code.ACCESS_DENIED_ERROR });
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: HttpRequestWithUser): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private verifyToken(token: string): HttpJwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      const decoded = verify(token, secret) as JwtPayload & Partial<HttpJwtPayload>;
      const id = decoded.sub ?? decoded.id;
      const email = decoded.email;
      const role = decoded.role;

      if (!id || !email || !role) {
        throw Exception.new({ code: Code.UNAUTHORIZED_ERROR });
      }

      return {
        id: String(id),
        email: String(email),
        role: role as UserRole,
      };
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }
      throw Exception.new({ code: Code.UNAUTHORIZED_ERROR });
    }
  }
}
