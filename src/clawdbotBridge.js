import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureClawdbot(config) {
  try {
    await fs.access(path.join(config.clawdbot.path, 'package.json'));
    return true;
  } catch {
    return false;
  }
}

export function startClawdbot(config) {
  const proc = spawn(config.clawdbot.startCommand, {
    cwd: config.clawdbot.path,
    shell: true,
    env: {
      ...process.env,
      TMPDIR: config.tempDir,
      TEMP: config.tempDir,
      TMP: config.tempDir
    },
    stdio: 'inherit'
  });

  return proc;
}
