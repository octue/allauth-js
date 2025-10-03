export const AUTHENTICATOR_KIND = Object.freeze({
  RECOVERY_CODES: 'recovery_codes',
  TOTP: 'totp',
  WEBAUTHN: 'webauthn',
})

export const AUTH_CHANGE_KIND = Object.freeze({
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
  REAUTHENTICATED: 'REAUTHENTICATED',
  REAUTHENTICATION_REQUIRED: 'REAUTHENTICATION_REQUIRED',
  FLOW_UPDATED: 'FLOW_UPDATED',
})

export const ACCEPT_JSON = Object.freeze({
  accept: 'application/json',
})

export const AUTH_PROCESS = Object.freeze({
  LOGIN: 'login',
  CONNECT: 'connect',
})

export const FLOWS = Object.freeze({
  VERIFY_EMAIL: 'verify_email',
  LOGIN: 'login',
  LOGIN_BY_CODE: 'login_by_code',
  SIGNUP: 'signup',
  PROVIDER_REDIRECT: 'provider_redirect',
  PROVIDER_SIGNUP: 'provider_signup',
  MFA_AUTHENTICATE: 'mfa_authenticate',
  REAUTHENTICATE: 'reauthenticate',
  MFA_REAUTHENTICATE: 'mfa_reauthenticate',
})
