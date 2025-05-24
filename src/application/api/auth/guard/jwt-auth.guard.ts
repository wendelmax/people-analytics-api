import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@core/common/enums/UserEnums';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { HttpRequestWithUser, HttpJwtPayload } from '../type/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HttpRequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      // Apenas extraímos os claims do token
      const payload = this.parseJwt(token);
      request.user = payload;

      // Verifica as roles necessárias
      const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];

      if (requiredRoles.length > 0) {
        const hasRole = requiredRoles.includes(payload.role);
        if (!hasRole) {
          throw Exception.new({ code: Code.ACCESS_DENIED_ERROR });
        }
      }

      return true;
    } catch (error) {
      if (error.code === Code.ACCESS_DENIED_ERROR) {
        throw error;
      }
      return false;
    }
  }

  private extractTokenFromHeader(request: HttpRequestWithUser): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private parseJwt(token: string): HttpJwtPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
}
