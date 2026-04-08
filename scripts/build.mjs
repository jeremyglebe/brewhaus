#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const commands = [
  ['npm', ['run', 'build', '--prefix', './shared']],
  ['npm', ['run', 'build', '--prefix', './server']],
  ['npm', ['run', 'build', '--prefix', './client']],
];

for (const [command, args] of commands) {
  const label = `${command} ${args.join(' ')}`;
  process.stdout.write(`\n==> ${label}\n`);

  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    process.stderr.write(`\nBuild step failed to start: ${label}\n`);
    process.stderr.write(`${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.stderr.write(`\nBuild step failed: ${label}\n`);
    process.exit(result.status ?? 1);
  }
}

process.stdout.write('\nAll builds completed successfully.\n');
