export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "DocIntel AI",
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;
