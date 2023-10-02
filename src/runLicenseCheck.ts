import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import path from 'path';

export async function runLicenseCheck({
  allowedLicenses,
  subDir
}: {
  allowedLicenses: string;
  subDir: string;
}) {

  let stdout = '';
  let stderr = '';

  const options: ExecOptions = {
    ignoreReturnCode: true,
    cwd: path.join(process.env.RUNNER_WORKSPACE as string, subDir),
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

  if (stderr.length > 0) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
}
