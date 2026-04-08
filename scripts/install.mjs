#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PACKAGES = [
  { name: 'shared', dir: path.join(REPO_ROOT, 'shared') },
  { name: 'server', dir: path.join(REPO_ROOT, 'server') },
  { name: 'client', dir: path.join(REPO_ROOT, 'client') },
];

const CLIENT_DIR = path.join(REPO_ROOT, 'client');

// Presence of these paths indicates `cap sync` has been run at least once.
const CAP_SYNC_INDICATORS = [
  path.join(CLIENT_DIR, 'android/app/src/main/assets/public'),
  path.join(CLIENT_DIR, 'ios/App/App/public'),
];

// Presence of these paths indicates the native project shells exist.
const CAP_NATIVE_DIRS = [
  path.join(CLIENT_DIR, 'android'),
  path.join(CLIENT_DIR, 'ios'),
];

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const options = {
    clean: false,
    resetCapacitor: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--clean') {
      options.clean = true;
      continue;
    }

    if (arg === '--reset-capacitor') {
      options.resetCapacitor = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  const helpText = [
    'Usage: node scripts/install.mjs [options]',
    '',
    'Installs all project dependencies and ensures Capacitor native projects are synced.',
    '',
    'Options:',
    '  --clean              Remove existing node_modules before installing',
    '  --reset-capacitor    Destructively remove and re-add native Capacitor projects.',
    '                       WARNING: this removes git-tracked files in client/android/',
    '                       and client/ios/ and cannot be undone without git.',
    '  --help, -h           Show help',
    '',
    'Examples:',
    '  node scripts/install.mjs',
    '  node scripts/install.mjs --clean',
    '  node scripts/install.mjs --clean --reset-capacitor',
  ].join('\n');

  process.stdout.write(`${helpText}\n`);
}

// ---------------------------------------------------------------------------
// Shell helpers
// ---------------------------------------------------------------------------

// Run a command synchronously, streaming stdout/stderr to the terminal.
// Exits the process immediately if the command fails.
function run(command, args, { cwd = REPO_ROOT, label = null } = {}) {
  const display = label ?? `${command} ${args.join(' ')}`;
  process.stdout.write(`\n==> ${display}\n`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      // Preserve color output for downstream tools.
      FORCE_COLOR: process.env.FORCE_COLOR ?? '1',
    },
  });

  if (result.error) {
    process.stderr.write(`Failed to start: ${display}\n${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.stderr.write(`Command failed (exit ${result.status}): ${display}\n`);
    process.exit(result.status ?? 1);
  }
}

// Prompt the user to type "yes" to confirm a destructive action.
// Returns a Promise<boolean>.
function confirm(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${prompt}\nType "yes" to continue: `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'yes');
    });
  });
}

// ---------------------------------------------------------------------------
// Install
// ---------------------------------------------------------------------------

// Optionally wipe node_modules then run npm install for one package directory.
function installPackage({ name, dir }, clean) {
  const nodeModules = path.join(dir, 'node_modules');

  if (clean && existsSync(nodeModules)) {
    process.stdout.write(`\n==> Removing ${name}/node_modules\n`);
    rmSync(nodeModules, { recursive: true, force: true });
  }

  run('npm', ['install', '--prefix', dir], { label: `npm install [${name}]` });
}

// ---------------------------------------------------------------------------
// Capacitor
// ---------------------------------------------------------------------------

// True when both Android and iOS web-asset directories exist, meaning
// `cap sync` has been run at least once since the client was built.
function isCapacitorSynced() {
  return CAP_SYNC_INDICATORS.every((p) => existsSync(p));
}

// True when both native project shells are present on disk.
function nativeProjectsExist() {
  return CAP_NATIVE_DIRS.every((p) => existsSync(p));
}

// Build the client web assets (vite only, no type-check) if dist is missing,
// then run `cap sync` to copy them into the native projects.
function syncCapacitor() {
  const distDir = path.join(CLIENT_DIR, 'dist');

  if (!existsSync(distDir)) {
    process.stdout.write('\nClient web assets not found. Building before Capacitor sync...\n');
    // Use build-only (plain vite build, no type-check) for speed during setup.
    run('npm', ['run', 'build-only', '--prefix', CLIENT_DIR], {
      label: 'npm run build-only [client]',
    });
  }

  run('npx', ['cap', 'sync'], { cwd: CLIENT_DIR, label: 'npx cap sync [client]' });
}

// Destructively remove and re-add native Capacitor projects, then sync.
// Caller is responsible for having already obtained user confirmation.
function resetCapacitorProjects() {
  for (const dir of CAP_NATIVE_DIRS) {
    const platform = path.basename(dir);

    if (existsSync(dir)) {
      process.stdout.write(`\n==> Removing client/${platform}\n`);
      rmSync(dir, { recursive: true, force: true });
    }
  }

  // Re-add both platforms from inside the client directory.
  run('npx', ['cap', 'add', 'android'], { cwd: CLIENT_DIR, label: 'npx cap add android' });
  run('npx', ['cap', 'add', 'ios'], { cwd: CLIENT_DIR, label: 'npx cap add ios' });

  syncCapacitor();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exit(1);
  }

  if (options.help) {
    printHelp();
    return;
  }

  // Guard the destructive --reset-capacitor path with a clear warning and confirmation.
  if (options.resetCapacitor) {
    process.stdout.write([
      '',
      '⚠️  WARNING: --reset-capacitor will permanently remove:',
      '     client/android/',
      '     client/ios/',
      '',
      '   These directories contain git-tracked files. Any local changes you',
      '   have made to the native projects will be lost. Run `git status` first',
      '   if you are unsure.',
      '',
    ].join('\n'));

    const confirmed = await confirm('Are you sure you want to reset the Capacitor native projects?');

    if (!confirmed) {
      process.stdout.write('Aborted.\n');
      process.exit(0);
    }
  }

  // Install all three packages in dependency order.
  for (const pkg of PACKAGES) {
    installPackage(pkg, options.clean);
  }

  // Handle Capacitor native projects.
  if (options.resetCapacitor) {
    process.stdout.write('\nResetting Capacitor native projects...\n');
    resetCapacitorProjects();
  } else if (!nativeProjectsExist()) {
    // Native project shells are missing entirely — add them from scratch.
    process.stdout.write('\nCapacitor native projects not found. Adding them...\n');
    run('npx', ['cap', 'add', 'android'], { cwd: CLIENT_DIR, label: 'npx cap add android' });
    run('npx', ['cap', 'add', 'ios'], { cwd: CLIENT_DIR, label: 'npx cap add ios' });
    syncCapacitor();
  } else if (!isCapacitorSynced()) {
    // Native shells exist but web assets have never been synced into them.
    process.stdout.write('\nCapacitor native projects exist but have not been synced. Syncing...\n');
    syncCapacitor();
  } else {
    process.stdout.write('\nCapacitor native projects are already synced.\n');
  }

  process.stdout.write('\nAll done.\n');
}

main().catch((error) => {
  process.stderr.write(`Unexpected error: ${error.message}\n`);
  process.exit(1);
});
