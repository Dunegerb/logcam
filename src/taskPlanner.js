export function planTask(taskInput) {
  const normalized = taskInput.trim();
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/(?:\s+then\s+|\n|;|\.\s+)/i)
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step, index) => ({
      id: index + 1,
      instruction: step,
      type: step.startsWith('run:') ? 'shell' : 'analysis'
    }));
}

export function summarizePlan(steps) {
  if (!steps.length) {
    return 'Nenhuma etapa identificada.';
  }
  return steps.map((s) => `${s.id}. [${s.type}] ${s.instruction}`).join('\n');
}
