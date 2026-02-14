import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { buildConfig } from './config.js';
import { PortableAgent } from './agent.js';
import { checkVoiceStack } from './speech.js';
import { ensureClawdbot, startClawdbot } from './clawdbotBridge.js';
import { clearSession, ensureTempDir, loadSession, saveSession } from './sessionStore.js';

async function main() {
  const config = buildConfig();
  await ensureTempDir(config);

  const rl = readline.createInterface({ input, output });
  const session = await loadSession(config);
  const agent = new PortableAgent(config, (state) => saveSession(config, state));
  await agent.hydrate(session);

  console.log('=== Portable Autonomous Agent ===');
  console.log(agent.describeSystem());
  console.log(`Temp dir: ${config.tempDir}`);

  const voiceState = await checkVoiceStack(config);
  console.log(`Voice: ${voiceState.ready ? 'ready' : `disabled (${voiceState.reason})`}`);

  const clawdbotReady = await ensureClawdbot(config);
  console.log(`Clawdbot: ${clawdbotReady ? 'detectado' : 'não encontrado em vendor/clawdbot'}`);

  if (clawdbotReady) {
    const shouldStart = await askYesNo(rl, 'Deseja iniciar o Clawdbot agora? (y/N): ');
    if (shouldStart) {
      startClawdbot(config);
    }
  }

  console.log('\nComandos: /status | /task ... | run:... | /wipe | /exit');

  while (true) {
    let msg;
    try {
      msg = await rl.question('\nVocê> ');
    } catch {
      break;
    }

    if (msg.trim() === '/exit') {
      break;
    }

    if (msg.trim() === '/wipe') {
      await clearSession(config);
      console.log('Sessão temporária removida.');
      continue;
    }

    const answer = await agent.handleMessage(msg, (q) => askYesNo(rl, `${q} (y/N): `));
    console.log(`\nAgente> ${answer}`);
  }

  rl.close();
  console.log('Encerrado.');
}

async function askYesNo(rl, prompt) {
  const value = (await rl.question(prompt)).trim().toLowerCase();
  return value === 'y' || value === 'yes' || value === 's' || value === 'sim';
}

main();
