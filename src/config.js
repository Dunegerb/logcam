import os from 'node:os';
import path from 'node:path';

export function buildConfig() {
  const rootDir = process.cwd();
  const tempDir = process.env.AGENT_TMP_DIR || path.join(rootDir, '.tmp');
  const lowResourceMode = (process.env.AGENT_LOW_RAM || '1') === '1';

  return {
    rootDir,
    tempDir,
    lowResourceMode,
    autoApproveLevel: process.env.AGENT_AUTO_APPROVE || 'safe',
    shellTimeoutMs: Number(process.env.AGENT_TIMEOUT_MS || 45_000),
    shellAllowList: [
      'pwd',
      'ls',
      'cat',
      'echo',
      'node',
      'npm',
      'python',
      'git',
      'date'
    ],
    sessionFile: path.join(tempDir, 'session.json'),
    voice: {
      enabled: (process.env.AGENT_VOICE || '0') === '1',
      whisperBin: process.env.WHISPER_BIN || path.join(rootDir, 'runtime', 'whisper.cpp', 'main'),
      whisperModel: process.env.WHISPER_MODEL || path.join(rootDir, 'models', 'ggml-base.bin'),
      piperBin: process.env.PIPER_BIN || path.join(rootDir, 'runtime', 'piper', 'piper'),
      piperModel: process.env.PIPER_MODEL || path.join(rootDir, 'models', 'pt_BR-faber-medium.onnx')
    },
    clawdbot: {
      path: process.env.CLAWDBOT_PATH || path.join(rootDir, 'vendor', 'clawdbot'),
      startCommand: process.env.CLAWDBOT_START || 'npm start'
    },
    hostMeta: {
      hostname: os.hostname(),
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length,
      memGb: (os.totalmem() / (1024 ** 3)).toFixed(1)
    }
  };
}
