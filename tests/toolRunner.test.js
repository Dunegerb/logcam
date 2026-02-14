import test from 'node:test';
import assert from 'node:assert/strict';
import { extractCommand, isAllowed } from '../src/toolRunner.js';

test('extractCommand remove prefixo run:', () => {
  assert.equal(extractCommand('run: pwd'), 'pwd');
});

test('isAllowed valida allowlist', () => {
  const config = { shellAllowList: ['pwd'] };
  assert.equal(isAllowed('pwd', config), true);
  assert.equal(isAllowed('rm -rf /', config), false);
});
