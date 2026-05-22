import { execSync } from "node:child_process";

const productionUrl = "https://frontend-chakibzzs-projects.vercel.app";

function hasUsableValue(value) {
  return Boolean(value && value.trim() && value.trim() !== "\"\"");
}

if (!hasUsableValue(process.env.NEXTAUTH_URL)) {
  process.env.NEXTAUTH_URL = productionUrl;
}

if (!hasUsableValue(process.env.NEXT_PUBLIC_SITE_URL)) {
  process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXTAUTH_URL;
}

if (!hasUsableValue(process.env.VERCEL_URL)) {
  process.env.VERCEL_URL = new URL(process.env.NEXTAUTH_URL).hostname;
}

execSync("npx prisma generate && npx next build", {
  env: process.env,
  stdio: "inherit",
});
