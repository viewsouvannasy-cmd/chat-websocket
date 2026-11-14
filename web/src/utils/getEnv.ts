export function getEnv(value: string): string {
  const env = import.meta.env[value];
  if (!env) {
    throw new Error(`${value} is not found`);
  }

  return env;
}
