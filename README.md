# Portable Autonomous Agent

Projeto novo que substitui o antigo logcam: um agente portátil para pendrive, com execução autônoma de tarefas **sob controle do usuário**, memória temporária e integração opcional com voz/offline.

## Objetivos

- Rodar em máquinas fracas (modo low-RAM).
- Não depender de instalação persistente no PC host.
- Usar diretórios temporários (RAM no Linux via `/dev/shm` quando possível).
- Permitir tarefas autônomas por etapas (`/task`) com confirmação antes de comandos shell.
- Integrar o ecossistema do Clawdbot quando presente.

## Estrutura

- `src/main.js`: loop de chat interativo.
- `src/agent.js`: comportamento autônomo e execução de tarefas.
- `src/toolRunner.js`: executor de comandos com allowlist.
- `src/taskPlanner.js`: quebra de objetivo em etapas.
- `src/speech.js`: STT/TTS offline (whisper.cpp + piper) opcional.
- `src/clawdbotBridge.js`: detecção/start do Clawdbot em `vendor/clawdbot`.
- `scripts/start-linux.sh`: inicialização com temp em RAM.
- `scripts/start-windows.bat`: inicialização portátil no Windows.

## Setup rápido

```bash
npm install
npm start
```

### Comandos no chat

- `/status` → mostra status da máquina.
- `/task <objetivo>` → o agente cria e executa plano por etapas.
- `run:<comando>` → executa comando único (com confirmação).
- `/wipe` → limpa sessão temporária.
- `/exit` → encerra.

## Integrar Clawdbot

```bash
git clone https://github.com/clawdbot/clawdbot.git vendor/clawdbot
cd vendor/clawdbot && npm install
```

Na próxima execução, o agente detecta e oferece iniciar automaticamente o Clawdbot.

## Voz (opcional)

Defina:

- `AGENT_VOICE=1`
- `WHISPER_BIN`, `WHISPER_MODEL`
- `PIPER_BIN`, `PIPER_MODEL`

Sem esses binários/modelos, o agente continua funcional em modo texto.

## Segurança operacional

- O agente não autoexecuta sem ação do usuário.
- Execução de shell protegida por allowlist e confirmação explícita.
- Sessão salva em diretório temporário para facilitar operação não persistente.
