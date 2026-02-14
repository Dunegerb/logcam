import test from 'node:test';
import assert from 'node:assert/strict';
import { planTask } from '../src/taskPlanner.js';

test('planTask separa etapas com then e ponto', () => {
  const result = planTask('run: pwd then run: date. validar saída');
  assert.equal(result.length, 3);
  assert.equal(result[0].type, 'shell');
  assert.equal(result[2].type, 'analysis');
});
