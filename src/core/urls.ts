import { FLOWS } from './constants'

// TODO REFACTOR REQUEST Make this framework independent and set it up
// to be configurable on a per-app basis. We should probably do something
// about configuration at the same time so there's no need to fetch configuration
// at app runtime (eg pre-fetch during a build step using a script)

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/api/browser/v1`

export const URLs = Object.freeze({
  // Meta
  CONFIG: `${BASE_URL}/config`,

  // Account management
  CHANGE_PASSWORD: `${BASE_URL}/account/password/change`,
  EMAIL: `${BASE_URL}/account/email`,
  PROVIDERS: `${BASE_URL}/account/providers`,

  // Account management: 2FA
  AUTHENTICATORS: `${BASE_URL}/account/authenticators`,
  RECOVERY_CODES: `${BASE_URL}/account/authenticators/recovery-codes`,
  TOTP_AUTHENTICATOR: `${BASE_URL}/account/authenticators/totp`,

  // Auth: Basics
  LOGIN: `${BASE_URL}/auth/login`,
  REQUEST_LOGIN_CODE: `${BASE_URL}/auth/code/request`,
  CONFIRM_LOGIN_CODE: `${BASE_URL}/auth/code/confirm`,
  SESSION: `${BASE_URL}/auth/session`,
  REAUTHENTICATE: `${BASE_URL}/auth/reauthenticate`,
  REQUEST_PASSWORD_RESET: `${BASE_URL}/auth/password/request`,
  RESET_PASSWORD: `${BASE_URL}/auth/password/reset`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  VERIFY_EMAIL: `${BASE_URL}/auth/email/verify`,

  // Auth: 2FA
  MFA_AUTHENTICATE: `${BASE_URL}/auth/2fa/authenticate`,
  MFA_REAUTHENTICATE: `${BASE_URL}/auth/2fa/reauthenticate`,

  // Auth: Social
  PROVIDER_SIGNUP: `${BASE_URL}/auth/provider/signup`,
  REDIRECT_TO_PROVIDER: `${BASE_URL}/auth/provider/redirect`,
  PROVIDER_TOKEN: `${BASE_URL}/auth/provider/token`,

  // Auth: Sessions
  SESSIONS: `${BASE_URL}/auth/sessions`,
} as const)

export const flow2path: Record<string, string> = {
  [FLOWS.LOGIN]: '/account/login',
  [FLOWS.LOGIN_BY_CODE]: '/account/login/confirm',
  [FLOWS.SIGNUP]: '/account/signup',
  [FLOWS.VERIFY_EMAIL]: '/account/verify-email',
  [FLOWS.PROVIDER_SIGNUP]: '/account/provider/signup',
  [FLOWS.MFA_AUTHENTICATE]: '/account/2fa/authenticate',
  [FLOWS.REAUTHENTICATE]: '/account/reauthenticate',
  [FLOWS.MFA_REAUTHENTICATE]: '/account/2fa/reauthenticate',
}
