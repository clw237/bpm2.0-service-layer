import { fetchSecrets } from '../utilities';

export const secretManagerConfig = async () => {
  const secretName: string | undefined = process.env.AWS_SECRET_NAME ?? '';
  const awsRegion: string | undefined = process.env.AWS_REGION ?? '';

  if (!secretName) {
    throw new Error(
      'AWS_SECRET_NAME is not defined in the environment variables',
    );
  }

  // Fetch secrets from environment variables or Secret Manager
  let username = process.env.DB_USERNAME;
  let password = process.env.DB_PASSWORD;

  // If either username or password is missing, fetch from Secret Manager
  if (process.env.DEBUG !== 'local') {
    const secrets = await fetchSecrets(secretName, awsRegion);

    if (!secrets) {
      throw new Error(
        `Unable to fetch secrets for secret name: ${secretName} and region: ${awsRegion}`,
      );
    }

    // Destructure the secrets
    username = username ?? secrets.username;
    password = password ?? secrets.password;
  }

  return {
    database: {
      username: username,
      password: String(password),
    },
  };
};
