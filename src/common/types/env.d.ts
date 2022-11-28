declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      API_BASE_URL: string;
      STRIPE_WEBHOOK_SECRET: string;
      NODEMAILER_HOST: string;
      NODEMAILER_PORT: number;
      NODEMAILER_AUTH_USER: string;
      NODEMAILER_AUTH_PASS: string;
    }
  }
}

export {};
