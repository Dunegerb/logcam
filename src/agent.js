import { extractCommand, runShellCommand } from './toolRunner.js';
import { planTask, summarizePlan } from './taskPlanner.js';

export class PortableAgent {
  constructor(config, sessionStore) {
    this.config = config;
    this.sessionStore = sessionStore;
    this.state = {
      history: [],
      tasks: []
    };
  }

  async hydrate(previousSession) {
    this.state = previousSession;
  }

  describeSystem() {
    const h = this.config.hostMeta;
    return `Host: ${h.hostname} | ${h.platform}/${h.arch} | CPU:${h.cpus} | RAM:${h.memGb}GB`;
  }

  async handleMessage(input, askApproval) {
    const trimmed = input.trim();
    if (!trimmed) {
      return 'Envie um comando. Exemplo: run: pwd';
    }

    if (trimmed === '/status') {
      return this.describeSystem();
    }

    if (trimmed.startsWith('/task ')) {
      const task = trimmed.replace('/task ', '');
      return this.runAutonomousTask(task, askApproval);
    }

    if (trimmed.startsWith('run:')) {
      return this.executeSingleCommand(trimmed, askApproval);
    }

    return 'Use /task <objetivo> para execução autônoma por etapas, ou run:<comando> para comando único.';
  }

  async executeSingleCommand(message, askApproval) {
    const command = extractCommand(message);
    const approved = await askApproval(`Executar comando: ${command}?`);
    if (!approved) {
      return 'Execução cancelada pelo usuário.';
    }

    const result = await runShellCommand(command, this.config);
    this.state.history.push({ command, result, at: new Date().toISOString() });
    await this.sessionStore(this.state);
    return `stdout:\n${result.stdout || '(vazio)'}\n\nstderr:\n${result.stderr || '(vazio)'}`;
  }

  async runAutonomousTask(taskInput, askApproval) {
    const steps = planTask(taskInput);
    if (!steps.length) {
      return 'Não consegui gerar etapas para essa tarefa.';
    }

    const outputs = [`Plano:\n${summarizePlan(steps)}`];
    for (const step of steps) {
      if (step.type === 'analysis') {
        outputs.push(`Etapa ${step.id}: ${step.instruction}`);
        continue;
      }

      const command = extractCommand(step.instruction);
      const approved = await askApproval(`Etapa ${step.id}: executar '${command}'?`);
      if (!approved) {
        outputs.push(`Etapa ${step.id} cancelada.`);
        continue;
      }

      try {
        const result = await runShellCommand(command, this.config);
        outputs.push(`Etapa ${step.id} concluída. stdout: ${result.stdout || '(vazio)'}`);
      } catch (error) {
        outputs.push(`Etapa ${step.id} falhou: ${error.message}`);
      }
    }

    this.state.tasks.push({ taskInput, steps, at: new Date().toISOString() });
    await this.sessionStore(this.state);
    return outputs.join('\n\n');
  }
}
