/**
 * Backend environment variable validation.
 * Validates all required vars at startup and throws with a clear message if any are missing.
 * See docs/environment-variables.md for the full variable matrix.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Supabase (required)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // Admin
  ADMIN_API_KEY: z.string().min(1, 'ADMIN_API_KEY is required'),

  // Blockchain (optional – feature-flagged)
  SOROBAN_CONTRACT_ADDRESS: z.string().optional(),
  STELLAR_NETWORK_URL: z.string().url().optional(),
  STELLAR_SECRET_KEY: z.string().optional(),

  // Push notifications (optional – feature-flagged)
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),
});

export type BackendEnv = z.infer<typeof envSchema>;

let _env: BackendEnv | null = null;

export function getEnv(): BackendEnv {
  if (_env) return _env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.errors
      .map((e) => `  ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(
      `Missing or invalid environment variables:\n${missing}\n\nSee docs/environment-variables.md for details.`
    );
  }

  _env = result.data;
  return _env;
}

/** Call this once at startup to validate all env vars eagerly. */
export function validateEnv(): void {
  getEnv();
}
