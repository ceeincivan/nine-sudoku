import { spawnSync } from "node:child_process";
import process from "node:process";

const args = process.argv.slice(2);
if (args.length === 0) {
  process.exit(0);
}

const command = args[0];
const cmdArgs = args.slice(1);

const result = spawnSync(command, cmdArgs, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 0);
