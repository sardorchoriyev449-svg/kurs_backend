import { SetMetadata } from '@nestjs/common';
import { UserRoles } from './user-roles.guard';

export const ROLES_KEY = 'allowedRoles';

/**
 * Admin va super_admin RolesGuard'da har doim ruxsat etiladi (o'zgarmadi).
 * @Roles(...) qo'yilsa, shu rollar ham qo'shimcha ravishda ruxsat oladi.
 * Masalan: @Roles(UserRoles.teacher) -> admin/super_admin + teacher kira oladi.
 * @Roles() qo'yilmagan controller'lar avvalgidek faqat admin/super_admin uchun qoladi.
 */
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
