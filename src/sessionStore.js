import fs from 'node:fs/promises';

export async function ensureTempDir(config) {
  await fs.mkdir(config.tempDir, { recursive: true });
}

export async function saveSession(config, payload) {
  const body = {
    ...payload,
    updatedAt: new Date().toISOString()
  };
  await fs.writeFile(config.sessionFile, JSON.stringify(body, null, 2), 'utf8');
}

export async function loadSession(config) {
  try {
    const raw = await fs.readFile(config.sessionFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { history: [], tasks: [] };
  }
}

export async function clearSession(config) {
  try {
    await fs.rm(config.sessionFile, { force: true });
  } catch {
    // no-op
  }
}
