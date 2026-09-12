export const PAGES = {
    HOME: '/',
    
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    PRICING: "/pricing",
    PRODUCTS: '/products',
    PRODUCT: (productId: string | number) => `/product/${productId}`,

    ACCOUNT: '/account',
    ACCOUNT_SECURITY: '/account/security',
    ACCOUNT_ORGANIZATION: '/account/organization',
    ACCOUNT_PROJECTS: '/account/projects',

    ABOUT_US: '/about-us',
    CONTACTS: '/contacts',
    SUPPORT: '/support',
}