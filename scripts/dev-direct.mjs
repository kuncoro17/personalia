import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const services = [
  { name: 'backend', cwd: path.join(repoRoot, 'backend') },
  { name: 'frontend', cwd: path.join(repoRoot, 'frontend') },
];

const children = services.map(service => {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: service.cwd,
    env: process.env,
    stdio: 'inherit',
  });

  child.on('exit', code => {
    if (shuttingDown) {
      return;
    }

    if (code !== 0) {
      console.error(`[${service.name}] exited with code ${code ?? 'unknown'}`);
      shutdown(1);
    }
  });

  child.on('error', error => {
    if (shuttingDown) {
      return;
    }

    console.error(`[${service.name}] failed to start`, error);
    shutdown(1);
  });

  return child;
});

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }
  }, 1_500).unref();

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
