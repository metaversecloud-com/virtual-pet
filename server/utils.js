import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function checkEnvVariables() {
  const requiredEnvVariables = [
    "INSTANCE_DOMAIN",
    "INSTANCE_PROTOCOL",
    "INTERACTIVE_KEY",
    "INTERACTIVE_SECRET",
  ];
  const missingVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables in the .env file: ${missingVariables.join(
        ", "
      )}`
    );
  }
}

export function getVersion() {
  try {
    const packageJsonContent = fs.readFileSync(
      path.join(__dirname, "../package.json"),
      "utf8"
    );
    const packageJson = JSON.parse(packageJsonContent);
    const version = packageJson.version;
    return version;
  } catch (error) {
    console.error("Error reading or parsing package.json:", error);
  }
}

export const getS3URL = () => {
  return `https://${
    process.env.S3_BUCKET || "sdk-virtual-pet"
  }.s3.amazonaws.com`;
};
