#!/usr/bin/env node

import { spawn } from 'node:child_process';
import readline from 'node:readline';

const ANSI = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const supportsColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;

function colorize(text, colorCode) {
  if (!supportsColor) {
    return text;
  }

  return `${colorCode}${text}${ANSI.reset}`;
}

function formatLabel(label) {
  if (label === 'server') {
    return colorize(label, ANSI.cyan);
  }

  if (label === 'client') {
    return colorize(label, ANSI.magenta);
  }

  if (label.endsWith(':err')) {
    return colorize(label, ANSI.red);
  }

  return colorize(label, ANSI.yellow);
}

function getChildEnv() {
  const env = { ...process.env };

  // Keep downstream colors enabled even though stdio is piped through this script.
  if (env.NO_COLOR === undefined) {
    env.FORCE_COLOR = env.FORCE_COLOR ?? '1';
    env.npm_config_color = env.npm_config_color ?? 'always';
  }

  return env;
}

const tasks = [
  {
    key: '1',
    name: 'server',
    command: 'npm',
    args: ['run', 'dev', '--prefix', './server'],
    child: null,
    exited: false,
  },
  {
    key: '2',
    name: 'client',
    command: 'npm',
    args: ['run', 'dev', '--prefix', './client'],
    child: null,
    exited: false,
  },
];

let shuttingDown = false;
let requestedExitCode = 0;

function prefixLines(stream, label) {
  const decoratedLabel = formatLabel(label);
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    process.stdout.write(`[${decoratedLabel}] ${line}\n`);
  });
}

function stopTask(task, signal = 'SIGTERM') {
  if (!task.child || task.exited || task.child.killed) {
    return;
  }

  try {
    task.child.kill(signal);
  } catch {
    // Ignore kill errors when process already exited.
  }
}

function stopAll(signal = 'SIGTERM') {
  for (const task of tasks) {
    stopTask(task, signal);
  }
}

function maybeExit() {
  if (tasks.every((task) => task.exited)) {
    process.exit(requestedExitCode);
  }
}

function initiateShutdown(exitCode = 0, reason = '') {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  requestedExitCode = exitCode;

  if (reason) {
    process.stdout.write(`${reason}\n`);
  }

  stopAll('SIGTERM');

  // Escalate if something ignores SIGTERM.
  setTimeout(() => {
    if (!tasks.every((task) => task.exited)) {
      stopAll('SIGKILL');
    }
  }, 1500);
}

function startTask(task) {
  const child = spawn(task.command, task.args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
    env: getChildEnv(),
  });

  task.child = child;

  if (child.stdout) {
    prefixLines(child.stdout, task.name);
  }

  if (child.stderr) {
    prefixLines(child.stderr, `${task.name}:err`);
  }

  child.on('error', (error) => {
    initiateShutdown(1, `Failed to start ${task.name}: ${error.message}`);
  });

  child.on('exit', (code, signal) => {
    task.exited = true;

    if (!shuttingDown && (code !== 0 || signal)) {
      const detail = signal ? `signal ${signal}` : `exit code ${code}`;
      initiateShutdown(1, `${task.name} exited unexpectedly (${detail}). Stopping all dev processes.`);
      return;
    }

    maybeExit();
  });
}

function printControls() {
  process.stdout.write('Starting dev processes...\n');
  process.stdout.write(
    `Controls: q = quit all, 1 = stop ${formatLabel('server')}, 2 = stop ${formatLabel('client')}, Ctrl+C = quit all\n\n`,
  );
}

function setupControls() {
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on('data', (chunk) => {
    const key = chunk.toString();

    if (key === '\u0003' || key === 'q') {
      initiateShutdown(0, 'Stopping all dev processes...');
      return;
    }

    const task = tasks.find((item) => item.key === key);
    if (task) {
      process.stdout.write(`Stopping ${task.name}...\n`);
      stopTask(task, 'SIGTERM');
    }
  });
}

printControls();
setupControls();
for (const task of tasks) {
  startTask(task);
}

process.on('SIGINT', () => {
  initiateShutdown(0, 'Stopping all dev processes...');
});

process.on('SIGTERM', () => {
  initiateShutdown(0, 'Stopping all dev processes...');
});
