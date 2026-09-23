import type { CookieOptions } from 'express';

const isProd = (): boolean => process.env.NODE_ENV === 'production';

export const getCookieOptions = (maxAge: number): CookieOptions => ({
    signed: true,
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? 'none' : 'lax',
    maxAge,
});
