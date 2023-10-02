import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import path from 'path';
import * as core from '@actions/core';

export async function runLicenseCheck({
  allowedLicenses,
  subDir
}: {
  allowedLicenses: string;
  subDir: string;
}) {

  let stdout = '';
  let stderr = '';
  const [owner, repo] = (process.env.REPOSITORY as string).split('/');

  const options: ExecOptions = {
    ignoreReturnCode: true,
    cwd: path.join(process.env.RUNNER_WORKSPACE as string, repo, subDir),
    listeners: {
      stdout: data => {
        stdout += data.toString();
      },
      stderr: data => {
        stderr += data.toString();
      }
    }
  };

  await exec(
    'npx',
    [
      '-q',
      '--yes',
      'license-checker',
      '--production',
      '--json',
      `--onlyAllow=${allowedLicenses}`
    ],
    options
  );

  core.info(`CWD: ${options.cwd}`)

  if (stderr.length > 0) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
}
