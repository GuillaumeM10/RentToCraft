import type { NextConfig } from "next";
import path from "path";
import { config } from "dotenv";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

config({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  sassOptions: {
    quietDeps: true,
    verbose: false,
    silenceDeprecations: ["*"],
    logger: {
      warn: () => {},
      debug: () => {},
    },
  },
  transpilePackages: ["@rent-to-craft/dtos"],
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.js$/,
      include: path.resolve(__dirname, "../../libs/dtos"),
      type: "javascript/auto",
    });

    if (dev) {
      config.infrastructureLogging = {
        level: "error",
      };
      config.stats = "errors-only";
    }

    return config;
  },
};

export default withPWA(nextConfig);
