import * as core from '@actions/core';
import * as fs from 'fs';
import path from 'path';
import { runLicenseCheck } from './runLicenseCheck';

async function run() {
  try {

      const allowedLicenses = core.getInput('allowed-licenses');
      //const allowedLicenses = "MIT; ISC; Apache-2.0; BlueOak-1.0.0"
      const subDir = core.getInput('sub-dir');
      //const subDir = '.';
      const output = await runLicenseCheck({ allowedLicenses, subDir });
      fs.mkdirSync('license-check');
      fs.writeFileSync(
        path.join('license-check', 'index.html'),
        `<html><body><pre><code>${output}</code></pre></body></html>`
      );

      return {
        metadata: JSON.parse(output),
        isOkay: true,
        shortText: 'All used licenses are allowed',
        text: output
      };

  } catch (error: any) {
    core.setFailed(error.message);
    fs.mkdirSync('license-check');
    fs.writeFileSync(
      path.join('license-check', 'index.html'),
      `<html><body><pre><code>${error.message}</code></pre></body></html>`
    );
    core.info('output written to license-check');
  }
}

run();
