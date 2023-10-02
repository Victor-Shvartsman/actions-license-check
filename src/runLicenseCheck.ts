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
  const [owner, repo] = (process.env.REPOSITORY as string).split('/');

  const options: ExecOptions = {
    //ignoreReturnCode: true,
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
  try {
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

    return stdout;
  } catch (error) {
    throw new Error(stderr);
  }
}
