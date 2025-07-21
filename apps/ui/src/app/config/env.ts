export const clientConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const serverConfig = {
  API_URL: process.env.API_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
