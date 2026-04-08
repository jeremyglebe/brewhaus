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
    name: 'server',
    command: 'npm',
    args: ['run', 'dev', '--prefix', './server'],
    child: null,
    exited: false,
    expectedExit: false,
    restartRequested: false,
  },
  {
    name: 'client',
    command: 'npm',
    args: ['run', 'dev', '--prefix', './client'],
    child: null,
    exited: false,
    expectedExit: false,
    restartRequested: false,
  },
];

let shuttingDown = false;
let requestedExitCode = 0;
const interactiveFooter = Boolean(process.stdout.isTTY && process.stdin.isTTY);

function getControlsText() {
  return `Controls: Ctrl+C quit | R restart both | A restart ${formatLabel('client')} | S restart ${formatLabel('server')} | I info`;
}

function clearFooter() {
  if (!interactiveFooter) {
    return;
  }

  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

function drawFooter() {
  if (!interactiveFooter || shuttingDown) {
    return;
  }

  clearFooter();
  process.stdout.write(getControlsText());
}

function writeLine(line) {
  if (interactiveFooter) {
    clearFooter();
  }

  process.stdout.write(`${line}\n`);

  if (interactiveFooter) {
    drawFooter();
  }
}

function prefixLines(stream, label) {
  const decoratedLabel = formatLabel(label);
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    writeLine(`[${decoratedLabel}] ${line}`);
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

function restartTask(task) {
  if (!task.child || task.exited) {
    writeLine(`Starting ${task.name}...`);
    startTask(task);
    return;
  }

  writeLine(`Restarting ${task.name}...`);
  task.restartRequested = true;
  task.expectedExit = true;
  stopTask(task, 'SIGTERM');

  // Escalate if the process does not exit promptly.
  setTimeout(() => {
    if (task.restartRequested && task.child && !task.exited && !task.child.killed) {
      stopTask(task, 'SIGKILL');
    }
  }, 1500);
}

function printInfo() {
  const statusLines = tasks.map((task) => {
    const running = task.child && !task.exited;
    return `- ${task.name}: ${running ? 'running' : 'stopped'}`;
  });

  writeLine('Dev process status:');
  for (const line of statusLines) {
    writeLine(line);
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
    writeLine(reason);
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
  task.exited = false;
  task.expectedExit = false;

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
    const wasExpected = task.expectedExit;

    task.exited = true;
    task.child = null;
    task.expectedExit = false;

    if (task.restartRequested && !shuttingDown) {
      task.restartRequested = false;
      startTask(task);
      return;
    }

    if (!shuttingDown && !wasExpected && (code !== 0 || signal)) {
      const detail = signal ? `signal ${signal}` : `exit code ${code}`;
      initiateShutdown(1, `${task.name} exited unexpectedly (${detail}). Stopping all dev processes.`);
      return;
    }

    maybeExit();
  });
}

function printControls() {
  writeLine('Starting dev processes (server + client)...');

  if (interactiveFooter) {
    drawFooter();
    process.stdout.write('\n');
    drawFooter();
    return;
  }

  process.stdout.write(`${getControlsText()}\n\n`);
}

function setupControls() {
  if (!process.stdin.isTTY) {
    return;
  }

  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on('data', (chunk) => {
    const key = chunk.toString();
    const normalized = key.trim().toUpperCase();

    if (key === '\u0003') {
      initiateShutdown(0, 'Stopping all dev processes...');
      return;
    }

    if (normalized === 'R') {
      for (const task of tasks) {
        restartTask(task);
      }
      return;
    }

    if (normalized === 'A') {
      const clientTask = tasks.find((task) => task.name === 'client');
      if (clientTask) {
        restartTask(clientTask);
      }
      return;
    }

    if (normalized === 'S') {
      const serverTask = tasks.find((task) => task.name === 'server');
      if (serverTask) {
        restartTask(serverTask);
      }
      return;
    }

    if (normalized === 'I') {
      printInfo();
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
