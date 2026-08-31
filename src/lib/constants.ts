const envUrl = (process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "").trim().replace(/\/+$/, '');

export const BASE_URL = (envUrl && !envUrl.toLowerCase().includes('eagle') && !envUrl.toLowerCase().includes('revolution'))
  ? envUrl
  : "https://410-muscletherapy.com";

