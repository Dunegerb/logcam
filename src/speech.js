import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function checkVoiceStack(config) {
  if (!config.voice.enabled) {
    return { ready: false, reason: 'VOICE desabilitado' };
  }

  try {
    await fs.access(config.voice.whisperBin);
    await fs.access(config.voice.whisperModel);
    await fs.access(config.voice.piperBin);
    await fs.access(config.voice.piperModel);
    return { ready: true };
  } catch {
    return { ready: false, reason: 'Binários/modelos de voz ausentes' };
  }
}

export async function transcribeWav(inputFile, config) {
  const outTxt = path.join(config.tempDir, `stt-${Date.now()}.txt`);
  await runProcess(config.voice.whisperBin, ['-m', config.voice.whisperModel, '-f', inputFile, '-otxt', '-of', outTxt.replace(/\.txt$/, '')]);
  return fs.readFile(outTxt, 'utf8');
}

export async function speak(text, config) {
  const output = path.join(config.tempDir, `tts-${Date.now()}.wav`);
  await runProcess(config.voice.piperBin, ['--model', config.voice.piperModel, '--output_file', output], text);
  return output;
}

function runProcess(bin, args, stdinText = '') {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args);
    let stderr = '';

    proc.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Processo finalizou com código ${code}`));
        return;
      }
      resolve();
    });

    if (stdinText) {
      proc.stdin.write(stdinText);
    }
    proc.stdin.end();
  });
}
