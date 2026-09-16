import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = fileURLToPath(new URL('./prepare-deploy-directories.sh', import.meta.url));

function run(args, fail = false) {
  const directory = mkdtempSync(join(tmpdir(), 'deploy-directories-test-'));
  const log = join(directory, 'commands');
  try {
    writeFileSync(log, '');
    writeFileSync(join(directory, 'sudo'), `#!/bin/sh
printf '%s\\n' "$*" >> "$TEST_COMMAND_LOG"
[ "$TEST_FAIL_SUDO" != 1 ] || exit 1
`, { mode: 0o700 });
    const result = spawnSync('sh', [script, ...args], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${directory}:${process.env.PATH}`,
        TEST_COMMAND_LOG: log, TEST_FAIL_SUDO: fail ? '1' : '0' },
    });
    return { ...result, commands: readFileSync(log, 'utf8').trim().split('\n').filter(Boolean) };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('preparation never recursively changes application data or uploads', () => {
  const result = run(['personalia-jkt', 'deploy']);
  assert.equal(result.status, 0, result.stderr);
  assert(result.stdout.includes('PREPARE: completed'));
  assert(result.commands.every(command => command.startsWith('-n ')));
  const recursive = result.commands.filter(command => command.includes('chown -R'));
  assert.deepEqual(recursive, ['-n chown -R deploy:deploy /opt/personalia-jkt/deployment']);
  assert(result.commands.some(command => command.startsWith('-n chown 1001:1001 /opt/personalia-jkt/backend/uploads')));
});

test('sudo failure stops immediately before any ownership changes', () => {
  const result = run(['personalia-jkt', 'deploy'], true);
  assert.notEqual(result.status, 0);
  assert.equal(result.commands.length, 1);
  assert(!result.stdout.includes('PREPARE: completed'));
});

test('invalid application paths are rejected before running sudo', () => {
  for (const name of ['..', '../other', 'app/name', 'app;whoami']) {
    const result = run([name, 'deploy']);
    assert.notEqual(result.status, 0);
    assert.deepEqual(result.commands, []);
  }
});
