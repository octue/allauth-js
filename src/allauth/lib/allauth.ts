import { getCSRFToken } from "./django"

// OpenAPI-aligned shapes (see django-allauth headless OpenAPI spec)
export type HTTPStatus = number

export interface ErrorItem {
  code: string
  message: string
  param?: string
}

export interface ErrorResponse {
  status: HTTPStatus
  errors: ErrorItem[]
}

/** Base meta for authentication responses (app clients may include tokens) */
export interface BaseAuthenticationMeta {
  session_token?: string
  access_token?: string
  [k: string]: unknown
}

/** Meta present on authentication responses; always contains is_authenticated */
export interface AuthenticationMeta extends BaseAuthenticationMeta {
  is_authenticated: boolean
}

/** More specific meta used when authentication indicates success */
export interface AuthenticatedMeta extends BaseAuthenticationMeta {
  is_authenticated: true
}

export const AuthenticatorKind = Object.freeze({
  RECOVERY_CODES: "recovery_codes",
  TOTP: "totp",
  WEBAUTHN: "webauthn"
} as const)

export type AuthenticatorKindValue =
  (typeof AuthenticatorKind)[keyof typeof AuthenticatorKind]

export interface Provider {
  id: string
  name?: string
  client_id?: string
  openid_configuration_url?: string
  flows?: string[]
  [k: string]: unknown
}

export interface Flow {
  id: string
  provider?: Provider
  is_pending?: boolean
  types?: AuthenticatorKindValue[]
  [k: string]: unknown
}

export interface User {
  id?: string | number
  display?: string
  has_usable_password?: boolean
  email?: string
  username?: string
  [k: string]: unknown
}

// AuthenticationMethod is a loose discriminated union in the spec; keep it permissive but typed.
export type AuthenticationMethod =
  | {
      method: "password" | "password_reset"
      at: number
      email?: string
      username?: string
    }
  | {
      method: "code"
      at: number
      email?: string
      phone?: string
    }
  | {
      method: "mfa"
      at: number
      id?: number
      type?: AuthenticatorKindValue
      reauthenticated?: boolean
    }
  | {
      method: "socialaccount"
      at: number
      provider: string
      uid: string
    }
  | Record<string, unknown>

export interface BaseAuthenticator {
  last_used_at?: number | null
  created_at: number
  [k: string]: unknown
}

export interface TOTPAuthenticator extends BaseAuthenticator {
  type: "totp"
}

export interface RecoveryCodesAuthenticator extends BaseAuthenticator {
  type: "recovery_codes"
  total_code_count: number
  unused_code_count: number
}

export interface SensitiveRecoveryCodesAuthenticator
  extends RecoveryCodesAuthenticator {
  unused_codes: string[]
}

export interface WebAuthnAuthenticator extends BaseAuthenticator {
  type: "webauthn"
  id: number
  name: string
  is_passwordless?: boolean
}

export type Authenticator =
  | TOTPAuthenticator
  | RecoveryCodesAuthenticator
  | SensitiveRecoveryCodesAuthenticator
  | WebAuthnAuthenticator

export type AuthenticatorList = Authenticator[]

export interface ProviderAccount {
  uid: string
  display: string
  provider: Provider
  [k: string]: unknown
}

export interface EmailAddress {
  email: string
  primary: boolean
  verified: boolean
}

export interface Session {
  user_agent: string
  ip: string
  created_at: number
  is_current: boolean
  id: number | string
  last_seen_at?: number
  [k: string]: unknown
}

export interface ConfigurationResponseData {
  account?: Record<string, unknown>
  socialaccount?: Record<string, unknown>
  mfa?: Record<string, unknown>
  usersessions?: Record<string, unknown>
}

export type ProviderAccountsResponse = ApiResponse<ProviderAccount[]>
export type EmailAddressesResponse = ApiResponse<EmailAddress[]>
export type SessionsResponse = ApiResponse<Session[]>
export type AuthenticatorListResponse = ApiResponse<AuthenticatorList>
export type TOTPAuthenticatorResponse = ApiResponse<TOTPAuthenticator>
export type RecoveryCodesResponse =
  ApiResponse<SensitiveRecoveryCodesAuthenticator>
export type ConfigurationResponse = ApiResponse<ConfigurationResponseData>
export type ProviderSignupResponse = ApiResponse<{
  email: EmailAddress[]
  account: ProviderAccount
  user: User
}>

export interface AuthData {
  user?: User | null
  flows?: Flow[]
  methods?: AuthenticationMethod[]
  [k: string]: unknown
}

export type ApiResponse<T = unknown> = {
  status: HTTPStatus
  meta?: Record<string, unknown> | AuthenticationMeta | AuthenticatedMeta
  data?: T
  errors?: ErrorItem[]
  [k: string]: unknown
}

export type AuthResponse = ApiResponse<AuthData>

// Simple empty response used for endpoints that return no structured data in 'data'
export type EmptyResponse = ApiResponse<null>

// Event type dispatched when authentication state changes
export type AuthChangeEvent<T = unknown> = CustomEvent<ApiResponse<T>>

// Event contents object (the initializer) which is { detail: msg }
export type AuthChangeEventContents<T = unknown> = {
  detail: ApiResponse<T>
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/api/browser/v1`

const ACCEPT_JSON: Record<string, string> = {
  accept: "application/json"
}

export const AuthProcess = Object.freeze({
  LOGIN: "login",
  CONNECT: "connect"
} as const)

export const Flows = Object.freeze({
  VERIFY_EMAIL: "verify_email",
  LOGIN: "login",
  LOGIN_BY_CODE: "login_by_code",
  SIGNUP: "signup",
  PROVIDER_REDIRECT: "provider_redirect",
  PROVIDER_SIGNUP: "provider_signup",
  MFA_AUTHENTICATE: "mfa_authenticate",
  REAUTHENTICATE: "reauthenticate",
  MFA_REAUTHENTICATE: "mfa_reauthenticate"
} as const)

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
  SESSIONS: `${BASE_URL}/auth/sessions`
} as const)

function postForm(action: string, data: Record<string, string>) {
  const f = document.createElement("form")
  f.method = "POST"
  f.action = action

  for (const key in data) {
    const d = document.createElement("input")
    d.type = "hidden"
    d.name = key
    d.value = data[key]
    f.appendChild(d)
  }
  document.body.appendChild(f)
  f.submit()
}

async function request<T = unknown>(
  method: string,
  path: string,
  data?: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  const options: RequestInit & {
    credentials?: RequestCredentials
    headers: Record<string, string>
  } = {
    method,
    // Don't pass authentication related headers to the config endpoint.
    credentials: path !== URLs.CONFIG ? "include" : "omit",
    // TODO Include csrftoken
    headers: {
      ...ACCEPT_JSON,
      ...headers
    }
  }

  if (method === "POST" || method === "PUT" || method === "DELETE") {
    const csrfToken = getCSRFToken()
    if (csrfToken) {
      options.headers["X-CSRFToken"] = csrfToken
    }
  }

  if (typeof data !== "undefined") {
    options.body = JSON.stringify(data)
    options.headers["Content-Type"] = "application/json"
  }
  const resp = await fetch(path, options)
  const msg = (await resp.json()) as ApiResponse<T>

  if (
    [401, 410].includes(msg.status as number) ||
    (msg.status === 200 &&
      (msg.meta as Record<string, unknown>)?.is_authenticated)
  ) {
    const event = new CustomEvent<ApiResponse<T>>("allauth.auth.change", {
      detail: msg
    } as AuthChangeEventContents<T>)
    document.dispatchEvent(event)
  }
  return msg
}

export async function login(data: unknown): Promise<AuthResponse> {
  return await request("POST", URLs.LOGIN, data)
}

export async function reauthenticate(data: unknown): Promise<AuthResponse> {
  return await request("POST", URLs.REAUTHENTICATE, data)
}

export async function logout(): Promise<AuthResponse> {
  return await request("DELETE", URLs.SESSION)
}

export async function signUp(data: unknown): Promise<AuthResponse> {
  return await request("POST", URLs.SIGNUP, data)
}

export async function providerSignup(data: unknown): Promise<AuthResponse> {
  return await request("POST", URLs.PROVIDER_SIGNUP, data)
}

export async function getProviderAccounts(): Promise<ProviderAccountsResponse> {
  return await request("GET", URLs.PROVIDERS)
}

export async function disconnectProviderAccount(
  providerId: string,
  accountUid: string
): Promise<ProviderAccountsResponse> {
  return await request("DELETE", URLs.PROVIDERS, {
    provider: providerId,
    account: accountUid
  })
}

export async function requestPasswordReset(
  email: string
): Promise<EmptyResponse> {
  return await request("POST", URLs.REQUEST_PASSWORD_RESET, { email })
}

export async function requestLoginCode(email: string): Promise<EmptyResponse> {
  return await request("POST", URLs.REQUEST_LOGIN_CODE, { email })
}

export async function confirmLoginCode(code: string): Promise<EmptyResponse> {
  return await request("POST", URLs.CONFIRM_LOGIN_CODE, { code })
}

export async function getEmailVerification(
  key: string
): Promise<EmptyResponse> {
  return await request("GET", URLs.VERIFY_EMAIL, undefined, {
    "X-Email-Verification-Key": key
  })
}

export async function getEmailAddresses(): Promise<EmailAddressesResponse> {
  return await request("GET", URLs.EMAIL)
}

export async function getSessions(): Promise<SessionsResponse> {
  return await request("GET", URLs.SESSIONS)
}

export async function endSessions(
  ids: (string | number)[]
): Promise<SessionsResponse> {
  return await request("DELETE", URLs.SESSIONS, { sessions: ids })
}

export async function getAuthenticators(): Promise<AuthenticatorListResponse> {
  return await request("GET", URLs.AUTHENTICATORS)
}

export async function getTOTPAuthenticator(): Promise<TOTPAuthenticatorResponse> {
  return await request("GET", URLs.TOTP_AUTHENTICATOR)
}

export async function mfaAuthenticate(code: string): Promise<AuthResponse> {
  return await request("POST", URLs.MFA_AUTHENTICATE, { code })
}

export async function mfaReauthenticate(code: string): Promise<AuthResponse> {
  return await request("POST", URLs.MFA_REAUTHENTICATE, { code })
}

export async function activateTOTPAuthenticator(
  code: string
): Promise<TOTPAuthenticatorResponse> {
  return await request("POST", URLs.TOTP_AUTHENTICATOR, { code })
}

export async function deactivateTOTPAuthenticator(): Promise<AuthenticatorListResponse> {
  return await request("DELETE", URLs.TOTP_AUTHENTICATOR)
}

export async function getRecoveryCodes(): Promise<RecoveryCodesResponse> {
  return await request("GET", URLs.RECOVERY_CODES)
}

export async function generateRecoveryCodes(): Promise<RecoveryCodesResponse> {
  return await request("POST", URLs.RECOVERY_CODES)
}

export async function getConfig(): Promise<ConfigurationResponse> {
  return await request("GET", URLs.CONFIG)
}

export async function addEmail(email: string): Promise<EmailAddressesResponse> {
  return await request("POST", URLs.EMAIL, { email })
}

export async function deleteEmail(
  email: string
): Promise<EmailAddressesResponse> {
  return await request("DELETE", URLs.EMAIL, { email })
}

export async function markEmailAsPrimary(
  email: string
): Promise<EmailAddressesResponse> {
  return await request("PATCH", URLs.EMAIL, { email, primary: true })
}

export async function requestEmailVerification(
  email: string
): Promise<EmptyResponse> {
  return await request("PUT", URLs.EMAIL, { email })
}

export async function verifyEmail(key: string): Promise<EmptyResponse> {
  return await request("POST", URLs.VERIFY_EMAIL, { key })
}

export async function getPasswordReset(key: string): Promise<EmptyResponse> {
  return await request("GET", URLs.RESET_PASSWORD, undefined, {
    "X-Password-Reset-Key": key
  })
}

export async function resetPassword(
  password: string,
  key: string
): Promise<EmptyResponse> {
  return await request(
    "POST",
    URLs.RESET_PASSWORD,
    { password, key },
    {
      "X-Password-Reset-Key": key
    }
  )
}

export async function changePassword(data: unknown): Promise<EmptyResponse> {
  return await request("POST", URLs.CHANGE_PASSWORD, data)
}

export async function getAuth(): Promise<AuthResponse> {
  return await request<AuthData>("GET", URLs.SESSION)
}

export async function authenticateByToken(
  providerId: string,
  token: string,
  process: string = AuthProcess.LOGIN
): Promise<AuthResponse> {
  return await request("POST", URLs.PROVIDER_TOKEN, {
    provider: providerId,
    token,
    process
  })
}

export function redirectToProvider(
  providerId: string,
  callbackURL: string,
  process: string = AuthProcess.LOGIN
) {
  const payload: Record<string, string> = {
    provider: providerId,
    process,
    callback_url: callbackURL
  }
  const csrf = getCSRFToken()
  if (csrf) {
    payload.csrfmiddlewaretoken = csrf
  }
  postForm(URLs.REDIRECT_TO_PROVIDER, payload)
}
