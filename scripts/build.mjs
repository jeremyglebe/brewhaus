#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const CLIENT_DIR = './client';

const commands = [
  ['npm', ['run', 'build', '--prefix', './shared']],
  ['npm', ['run', 'build', '--prefix', './server']],
  ['npm', ['run', 'build', '--prefix', CLIENT_DIR]],
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

// Sync the freshly built client web assets into the Capacitor native projects.
process.stdout.write('\n==> npx cap sync [client]\n');

const syncResult = spawnSync('npx', ['cap', 'sync'], {
  cwd: CLIENT_DIR,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (syncResult.error) {
  process.stderr.write(`\nCap sync failed to start: ${syncResult.error.message}\n`);
  process.exit(1);
}

if (syncResult.status !== 0) {
  process.stderr.write(`\nCap sync failed (exit ${syncResult.status})\n`);
  process.exit(syncResult.status ?? 1);
}

process.stdout.write('\nAll builds completed and Capacitor synced successfully.\n');
