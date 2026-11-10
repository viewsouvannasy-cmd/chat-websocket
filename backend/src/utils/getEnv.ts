export default function getEnv(value: string): string {
  const env = process.env[value];

  if (!env) {
    throw new Error(`${env} is not found`);
  }

  return env;
}
