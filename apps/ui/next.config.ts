import type { NextConfig } from "next";
import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
    quietDeps: true,
    verbose: false,
    logger: {
      warn: function (message: string) {
        if (message.includes("deprecation")) {
          return;
        }
        console.warn(message);
      },
    },
  },
};

export default nextConfig;
