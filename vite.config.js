import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "schedule";
const isCustomDomain = fs.existsSync("CNAME");
const base = isCustomDomain ? "/" : process.env.GITHUB_ACTIONS ? `/${repoName}/` : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
