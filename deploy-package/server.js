const { spawn } = require('child_process');
const path = require('path');

const appDir = __dirname;
const serverEntry = path.join(appDir, 'dist/physician-client-app/server/server.mjs');

const child = spawn(process.execPath, [serverEntry], {
  cwd: appDir,
  env: { ...process.env, PORT: process.env.PORT || '8080' },
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code || 0);
  }
});
