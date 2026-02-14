import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export function extractCommand(text) {
  return text.replace(/^run:/i, '').trim();
}

export function isAllowed(command, config) {
  const [binary] = command.split(/\s+/);
  return config.shellAllowList.includes(binary);
}

export async function runShellCommand(command, config) {
  if (!isAllowed(command, config)) {
    throw new Error(`Comando não permitido: ${command}`);
  }

  const { stdout, stderr } = await execAsync(command, {
    cwd: config.rootDir,
    timeout: config.shellTimeoutMs,
    env: {
      ...process.env,
      TMPDIR: config.tempDir,
      TEMP: config.tempDir,
      TMP: config.tempDir
    },
    maxBuffer: 1024 * 1024
  });

  return { stdout: stdout.trim(), stderr: stderr.trim() };
}
