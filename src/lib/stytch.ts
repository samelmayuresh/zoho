import * as stytch from 'stytch'

// Server-side Stytch client
export const stytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID!,
  secret: process.env.STYTCH_SECRET!,
  env: process.env.STYTCH_ENVIRONMENT === 'live' ? stytch.envs.live : stytch.envs.test,
})

// Client-side configuration
export const stytchConfig = {
  publicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!,
  environment: process.env.STYTCH_ENVIRONMENT === 'live' ? 'live' : 'test' as const,
}