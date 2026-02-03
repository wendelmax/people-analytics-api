import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { sign } from 'jsonwebtoken';
import { UserRole } from '@core/common/enums/UserEnums';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, _password: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const adminProfile = await this.prisma.admin.findUnique({
      where: { employeeId: employee.id },
    });

    let role: UserRole = UserRole.EMPLOYEE;

    if (adminProfile) {
      switch (adminProfile.role) {
        case 'SUPER_ADMIN':
          role = UserRole.SUPER_ADMIN;
          break;
        case 'ORG_ADMIN':
          role = UserRole.ADMIN;
          break;
        case 'HR_ADMIN':
          role = UserRole.HR_MANAGER;
          break;
      }
    } else if (employee.managerId) {
      role = UserRole.MANAGER;
    }

    const payload = {
      sub: employee.id,
      id: employee.id,
      email: employee.email,
      role: role,
    };

    const accessToken = sign(payload, secret, { expiresIn: '24h' });

    return {
      accessToken,
      token: accessToken,
      user: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: role,
      },
    };
  }
}
