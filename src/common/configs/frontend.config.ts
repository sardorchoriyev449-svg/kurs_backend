export const getFrontendUrl = (): string =>
    (process.env.FRONTEND_URL ?? 'https://kurs-frontend-roan.vercel.app') as string
