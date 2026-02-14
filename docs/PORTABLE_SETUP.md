# Guia portátil (pendrive)

## 1) Preparar pendrive

Copie esta pasta inteira para o pendrive.

## 2) Pré-requisitos por host

- Node.js 18+
- Microfone/áudio (opcional para voz)

## 3) Inicialização

### Linux

```bash
./scripts/start-linux.sh
```

Esse script exporta `AGENT_TMP_DIR` para `/dev/shm/portable-agent-$USER` (RAM), reduzindo escrita em disco.

### Windows

Execute:

```bat
scripts\start-windows.bat
```

## 4) Limpeza de sessão

```bash
./scripts/cleanup.sh
```

Ou use `/wipe` dentro do chat.

## 5) Modo PC fraco

Já vem ativado com `AGENT_LOW_RAM=1`. Para reforçar:

- evite modelos grandes;
- use whisper tiny/base;
- desative voz se necessário.
