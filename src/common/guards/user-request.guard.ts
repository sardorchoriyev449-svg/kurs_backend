import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from "express";
import { UserRoles } from './user-roles.guard';
import { ROLES_KEY } from './roles.decorator';

export class RequestWithUser extends Request {
    user: {
        id: string;
        first_name: string;
        last_name: string;
        login:string;
        password:string;
        role: string;
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithUser>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Siz avtorizatsiyadan o\'tmagansiz');
    }

    // admin/super_admin har doim, hamma joyda ruxsat etiladi (avvalgidek)
    if (user.role === UserRoles.admin || user.role === UserRoles.superAdmin) {
      return true;
    }

    const allowedRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // @Roles(...) qo'yilmagan bo'lsa - avvalgidek faqat admin/super_admin
    if (allowedRoles && allowedRoles.includes(user.role as UserRoles)) {
      return true;
    }

    throw new ForbiddenException('Faqat admin kiroladi');
  }
}