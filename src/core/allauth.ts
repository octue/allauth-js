import { ACCEPT_JSON, AUTH_CHANGE_KIND, AUTH_PROCESS } from './constants'
import { getCSRFToken } from './csrf'
import { URLs } from './urls'
import type {
  ActivateTOTPResult,
  AddEmailResult,
  ApiResponse,
  AuthChangeEventContents,
  AuthData,
  AuthenticateByTokenResult,
  AuthenticatedMeta,
  AuthenticationMeta,
  AuthenticatorList,
  AuthInfo,
  AuthResponse,
  ChangePasswordResult,
  ConfigurationResponse,
  ConfigurationResponseData,
  ConfirmLoginCodeResult,
  DeactivateTOTPResult,
  DeleteEmailResult,
  DisconnectProviderResult,
  EmailAddress,
  EmailVerificationResult,
  EndSessionsResult,
  GenerateRecoveryCodesResult,
  GetAuthenticatorsResult,
  GetAuthResult,
  GetConfigResult,
  GetEmailAddressesResult,
  GetEmailVerificationResult,
  GetPasswordResetResult,
  GetProviderAccountsResult,
  GetRecoveryCodesResult,
  GetSessionsResult,
  GetTOTPAuthenticatorResult,
  LoginResult,
  LogoutResult,
  MarkPrimaryResult,
  MfaAuthenticateResult,
  MfaReauthenticateResult,
  ProviderAccount,
  ProviderSignupResult,
  ReauthenticateResult,
  RequestLoginCodeResult,
  RequestPasswordResetResult,
  ResetPasswordResult,
  SensitiveRecoveryCodesAuthenticator,
  Session,
  SignupResult,
  TOTPAuthenticator,
  VerifyEmailResult,
} from './types'

function postForm(action: string, data: Record<string, string>) {
  const f = document.createElement('form')
  f.method = 'POST'
  f.action = action
  for (const key in data) {
    const d = document.createElement('input')
    d.type = 'hidden'
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
    credentials: path !== URLs.CONFIG ? 'include' : 'omit',
    headers: {
      ...ACCEPT_JSON,
      ...headers,
    },
  }

  if (
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE'
  ) {
    const csrfToken = getCSRFToken()
    if (csrfToken) {
      options.headers['X-CSRFToken'] = csrfToken
    }
  }

  if (typeof data !== 'undefined') {
    options.body = JSON.stringify(data)
    options.headers['Content-Type'] = 'application/json'
  }
  const resp = await fetch(path, options)
  const msg = (await resp.json()) as ApiResponse<T>

  if (
    [401, 410].includes(msg.status as number) ||
    (msg.status === 200 &&
      (msg.meta as Record<string, unknown>)?.is_authenticated)
  ) {
    const event = new CustomEvent<ApiResponse<T>>('allauth.auth.change', {
      detail: msg,
    } as AuthChangeEventContents<T>)
    document.dispatchEvent(event)
  }
  return msg
}

// ============================================================================
// Result Transformers
// Convert raw ApiResponse to discriminated union result types
// ============================================================================

// --- Email Management Transformers ---

// PUT /account/email → 200, 400, 403, 429
function toEmailVerificationResult(
  response: ApiResponse<null>
): EmailVerificationResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: null }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 403:
      return { status: 403, ok: false, reason: 'rate_limited' }
    case 429:
      return { status: 429, ok: false, reason: 'too_many_requests' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /account/email → 200, 400, 401, 409, 429
function toAddEmailResult(
  response: ApiResponse<EmailAddress[]>
): AddEmailResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: response.data ?? [] }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return { status: 401, ok: false, reason: 'authentication_required' }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    case 429:
      return { status: 429, ok: false, reason: 'too_many_requests' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// DELETE /account/email → 200, 400, 429
function toDeleteEmailResult(
  response: ApiResponse<EmailAddress[]>
): DeleteEmailResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: response.data ?? [] }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 429:
      return { status: 429, ok: false, reason: 'too_many_requests' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// PATCH /account/email → 200, 400, 429
function toMarkPrimaryResult(
  response: ApiResponse<EmailAddress[]>
): MarkPrimaryResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: response.data ?? [] }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 429:
      return { status: 429, ok: false, reason: 'too_many_requests' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// GET /account/email → 200
function toGetEmailAddressesResult(
  response: ApiResponse<EmailAddress[]>
): GetEmailAddressesResult {
  return { status: 200, ok: true, data: response.data ?? [] }
}

// --- Auth Flow Transformers ---

// POST /auth/login → 200, 400, 401, 409
function toLoginResult(response: ApiResponse<AuthData>): LoginResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /auth/signup → 200, 400, 401, 403, 409
function toSignupResult(response: ApiResponse<AuthData>): SignupResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 403:
      return { status: 403, ok: false, reason: 'forbidden' }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// GET /auth/session → 200, 401, 410
function toGetAuthResult(response: ApiResponse<AuthData>): GetAuthResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 410:
      return { status: 410, ok: false, reason: 'session_expired' }
    default:
      // Treat unexpected as 401 with empty data
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: (response.meta as AuthenticationMeta) ?? {
          is_authenticated: false,
        },
      }
  }
}

// DELETE /auth/session → 401
function toLogoutResult(response: ApiResponse<AuthData>): LogoutResult {
  return {
    status: 401,
    ok: false,
    data: response.data ?? {},
    meta: (response.meta as AuthenticationMeta) ?? { is_authenticated: false },
  }
}

// POST /auth/reauthenticate → 200, 400
function toReauthenticateResult(
  response: ApiResponse<AuthData>
): ReauthenticateResult {
  if (response.status === 200) {
    return {
      status: 200,
      ok: true,
      data: response.data ?? {},
      meta: response.meta as AuthenticatedMeta,
    }
  }
  return { status: 400, ok: false, errors: response.errors ?? [] }
}

// --- Password Reset Transformers ---

// POST /auth/password/request → 200, 400, 401
function toRequestPasswordResetResult(
  response: ApiResponse<AuthData>
): RequestPasswordResetResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: null }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// GET /auth/password/reset → 200, 400, 409
function toGetPasswordResetResult(
  response: ApiResponse<null>
): GetPasswordResetResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: null }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /auth/password/reset → 200, 400, 401, 409
function toResetPasswordResult(
  response: ApiResponse<AuthData>
): ResetPasswordResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /account/password/change → 200, 400, 401
function toChangePasswordResult(
  response: ApiResponse<null>
): ChangePasswordResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: null }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return { status: 401, ok: false, reason: 'authentication_required' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// --- Login by Code Transformers ---

// POST /auth/code/request → 400, 401
function toRequestLoginCodeResult(
  response: ApiResponse<AuthData>
): RequestLoginCodeResult {
  if (response.status === 401) {
    return {
      status: 401,
      ok: false,
      data: response.data ?? {},
      meta: response.meta as AuthenticationMeta,
    }
  }
  return { status: 400, ok: false, errors: response.errors ?? [] }
}

// POST /auth/code/confirm → 200, 400, 401, 409
function toConfirmLoginCodeResult(
  response: ApiResponse<AuthData>
): ConfirmLoginCodeResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// --- Email Verification (key-based) Transformers ---

// GET /auth/email/verify → 200, 400, 409
function toGetEmailVerificationResult(
  response: ApiResponse<{ email: string; user: { username?: string } }>
): GetEmailVerificationResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? { email: '', user: {} },
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /auth/email/verify → 200, 400, 401, 409
function toVerifyEmailResult(
  response: ApiResponse<AuthData>
): VerifyEmailResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// --- Provider/Social Auth Transformers ---

// GET /account/providers → 200
function toGetProviderAccountsResult(
  response: ApiResponse<ProviderAccount[]>
): GetProviderAccountsResult {
  return { status: 200, ok: true, data: response.data ?? [] }
}

// DELETE /account/providers → 200, 400
function toDisconnectProviderResult(
  response: ApiResponse<ProviderAccount[]>
): DisconnectProviderResult {
  if (response.status === 200) {
    return { status: 200, ok: true, data: response.data ?? [] }
  }
  return { status: 400, ok: false, errors: response.errors ?? [] }
}

// POST /auth/provider/token → 200, 400, 401, 403
function toAuthenticateByTokenResult(
  response: ApiResponse<AuthData>
): AuthenticateByTokenResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 403:
      return { status: 403, ok: false, reason: 'forbidden' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /auth/provider/signup → 200, 400, 401, 403, 409
function toProviderSignupResult(
  response: ApiResponse<AuthData>
): ProviderSignupResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    case 403:
      return { status: 403, ok: false, reason: 'forbidden' }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// --- MFA/2FA Transformers ---

// POST /auth/2fa/authenticate → 200, 400, 401
function toMfaAuthenticateResult(
  response: ApiResponse<AuthData>
): MfaAuthenticateResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {},
        meta: response.meta as AuthenticatedMeta,
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return {
        status: 401,
        ok: false,
        data: response.data ?? {},
        meta: response.meta as AuthenticationMeta,
      }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// POST /auth/2fa/reauthenticate → 200, 400
function toMfaReauthenticateResult(
  response: ApiResponse<AuthData>
): MfaReauthenticateResult {
  if (response.status === 200) {
    return {
      status: 200,
      ok: true,
      data: response.data ?? {},
      meta: response.meta as AuthenticatedMeta,
    }
  }
  return { status: 400, ok: false, errors: response.errors ?? [] }
}

// GET /account/authenticators → 200, 401, 410
function toGetAuthenticatorsResult(
  response: ApiResponse<AuthenticatorList>
): GetAuthenticatorsResult {
  switch (response.status) {
    case 200:
      return { status: 200, ok: true, data: response.data ?? [] }
    case 401:
      return { status: 401, ok: false, reason: 'authentication_required' }
    case 410:
      return { status: 410, ok: false, reason: 'session_expired' }
    default:
      return { status: 401, ok: false, reason: 'authentication_required' }
  }
}

// GET /account/authenticators/totp → 200, 404, 409
function toGetTOTPAuthenticatorResult(
  response: ApiResponse<TOTPAuthenticator>
): GetTOTPAuthenticatorResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? { type: 'totp', created_at: 0 },
      }
    case 404:
      return { status: 404, ok: false, reason: 'not_found' }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return { status: 404, ok: false, reason: 'not_found' }
  }
}

// POST /account/authenticators/totp → 200, 400, 401, 409
function toActivateTOTPResult(
  response: ApiResponse<TOTPAuthenticator>
): ActivateTOTPResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? { type: 'totp', created_at: 0 },
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    case 401:
      return { status: 401, ok: false, reason: 'reauthentication_required' }
    case 409:
      return { status: 409, ok: false, reason: 'conflict' }
    default:
      return {
        status: 400,
        ok: false,
        errors: response.errors ?? [
          { code: 'unknown', message: `Unexpected status: ${response.status}` },
        ],
      }
  }
}

// DELETE /account/authenticators/totp → 200, 401
function toDeactivateTOTPResult(
  response: ApiResponse<AuthenticatorList>
): DeactivateTOTPResult {
  if (response.status === 200) {
    return { status: 200, ok: true, data: response.data ?? [] }
  }
  return { status: 401, ok: false, reason: 'reauthentication_required' }
}

// GET /account/authenticators/recovery-codes → 200, 401, 404
function toGetRecoveryCodesResult(
  response: ApiResponse<SensitiveRecoveryCodesAuthenticator>
): GetRecoveryCodesResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {
          type: 'recovery_codes',
          created_at: 0,
          total_code_count: 0,
          unused_code_count: 0,
          unused_codes: [],
        },
      }
    case 401:
      return { status: 401, ok: false, reason: 'reauthentication_required' }
    case 404:
      return { status: 404, ok: false, reason: 'not_found' }
    default:
      return { status: 401, ok: false, reason: 'reauthentication_required' }
  }
}

// POST /account/authenticators/recovery-codes → 200, 400, 401
function toGenerateRecoveryCodesResult(
  response: ApiResponse<SensitiveRecoveryCodesAuthenticator>
): GenerateRecoveryCodesResult {
  switch (response.status) {
    case 200:
      return {
        status: 200,
        ok: true,
        data: response.data ?? {
          type: 'recovery_codes',
          created_at: 0,
          total_code_count: 0,
          unused_code_count: 0,
          unused_codes: [],
        },
      }
    case 400:
      return { status: 400, ok: false, errors: response.errors ?? [] }
    default:
      return { status: 401, ok: false, reason: 'reauthentication_required' }
  }
}

// --- Sessions Transformers ---

// GET /auth/sessions → 200
function toGetSessionsResult(
  response: ApiResponse<Session[]>
): GetSessionsResult {
  return { status: 200, ok: true, data: response.data ?? [] }
}

// DELETE /auth/sessions → 200, 401
function toEndSessionsResult(
  response: ApiResponse<Session[]>
): EndSessionsResult {
  if (response.status === 200) {
    return { status: 200, ok: true, data: response.data ?? [] }
  }
  return { status: 401, ok: false, reason: 'authentication_required' }
}

// --- Config Transformers ---

// GET /config → 200
function toGetConfigResult(
  response: ApiResponse<ConfigurationResponseData>
): GetConfigResult {
  return { status: 200, ok: true, data: response.data ?? {} }
}

// ============================================================================
// Exported API Functions
// ============================================================================

export async function login(data: unknown): Promise<LoginResult> {
  const response = await request<AuthData>('POST', URLs.LOGIN, data)
  return toLoginResult(response)
}

export async function reauthenticate(
  data: unknown
): Promise<ReauthenticateResult> {
  const response = await request<AuthData>('POST', URLs.REAUTHENTICATE, data)
  return toReauthenticateResult(response)
}

export async function logout(): Promise<LogoutResult> {
  const response = await request<AuthData>('DELETE', URLs.SESSION)
  return toLogoutResult(response)
}

export async function signUp<T extends Record<string, unknown>>(
  data: T
): Promise<SignupResult> {
  const response = await request<AuthData>('POST', URLs.SIGNUP, data)
  return toSignupResult(response)
}

export async function providerSignup(
  data: unknown
): Promise<ProviderSignupResult> {
  const response = await request<AuthData>('POST', URLs.PROVIDER_SIGNUP, data)
  return toProviderSignupResult(response)
}

export async function getProviderAccounts(): Promise<GetProviderAccountsResult> {
  const response = await request<ProviderAccount[]>('GET', URLs.PROVIDERS)
  return toGetProviderAccountsResult(response)
}

export async function disconnectProviderAccount(
  providerId: string,
  accountUid: string
): Promise<DisconnectProviderResult> {
  const response = await request<ProviderAccount[]>('DELETE', URLs.PROVIDERS, {
    provider: providerId,
    account: accountUid,
  })
  return toDisconnectProviderResult(response)
}

export async function requestPasswordReset(
  email: string
): Promise<RequestPasswordResetResult> {
  const response = await request<AuthData>(
    'POST',
    URLs.REQUEST_PASSWORD_RESET,
    { email }
  )
  return toRequestPasswordResetResult(response)
}

export async function requestLoginCode(
  email: string
): Promise<RequestLoginCodeResult> {
  const response = await request<AuthData>('POST', URLs.REQUEST_LOGIN_CODE, {
    email,
  })
  return toRequestLoginCodeResult(response)
}

export async function confirmLoginCode(
  code: string
): Promise<ConfirmLoginCodeResult> {
  const response = await request<AuthData>('POST', URLs.CONFIRM_LOGIN_CODE, {
    code,
  })
  return toConfirmLoginCodeResult(response)
}

export async function getEmailVerification(
  key: string
): Promise<GetEmailVerificationResult> {
  const response = await request<{
    email: string
    user: { username?: string }
  }>('GET', URLs.VERIFY_EMAIL, undefined, {
    'X-Email-Verification-Key': key,
  })
  return toGetEmailVerificationResult(response)
}

export async function getEmailAddresses(): Promise<GetEmailAddressesResult> {
  const response = await request<EmailAddress[]>('GET', URLs.EMAIL)
  return toGetEmailAddressesResult(response)
}

export async function getSessions(): Promise<GetSessionsResult> {
  const response = await request<Session[]>('GET', URLs.SESSIONS)
  return toGetSessionsResult(response)
}

export async function endSessions(
  ids: (string | number)[]
): Promise<EndSessionsResult> {
  const response = await request<Session[]>('DELETE', URLs.SESSIONS, {
    sessions: ids,
  })
  return toEndSessionsResult(response)
}

export async function getAuthenticators(): Promise<GetAuthenticatorsResult> {
  const response = await request<AuthenticatorList>('GET', URLs.AUTHENTICATORS)
  return toGetAuthenticatorsResult(response)
}

export async function getTOTPAuthenticator(): Promise<GetTOTPAuthenticatorResult> {
  const response = await request<TOTPAuthenticator>(
    'GET',
    URLs.TOTP_AUTHENTICATOR
  )
  return toGetTOTPAuthenticatorResult(response)
}

export async function mfaAuthenticate(
  code: string
): Promise<MfaAuthenticateResult> {
  const response = await request<AuthData>('POST', URLs.MFA_AUTHENTICATE, {
    code,
  })
  return toMfaAuthenticateResult(response)
}

export async function mfaReauthenticate(
  code: string
): Promise<MfaReauthenticateResult> {
  const response = await request<AuthData>('POST', URLs.MFA_REAUTHENTICATE, {
    code,
  })
  return toMfaReauthenticateResult(response)
}

export async function activateTOTPAuthenticator(
  code: string
): Promise<ActivateTOTPResult> {
  const response = await request<TOTPAuthenticator>(
    'POST',
    URLs.TOTP_AUTHENTICATOR,
    { code }
  )
  return toActivateTOTPResult(response)
}

export async function deactivateTOTPAuthenticator(): Promise<DeactivateTOTPResult> {
  const response = await request<AuthenticatorList>(
    'DELETE',
    URLs.TOTP_AUTHENTICATOR
  )
  return toDeactivateTOTPResult(response)
}

export async function getRecoveryCodes(): Promise<GetRecoveryCodesResult> {
  const response = await request<SensitiveRecoveryCodesAuthenticator>(
    'GET',
    URLs.RECOVERY_CODES
  )
  return toGetRecoveryCodesResult(response)
}

export async function generateRecoveryCodes(): Promise<GenerateRecoveryCodesResult> {
  const response = await request<SensitiveRecoveryCodesAuthenticator>(
    'POST',
    URLs.RECOVERY_CODES
  )
  return toGenerateRecoveryCodesResult(response)
}

export async function getConfig(): Promise<GetConfigResult> {
  const response = await request<ConfigurationResponseData>('GET', URLs.CONFIG)
  return toGetConfigResult(response)
}

export async function addEmail(email: string): Promise<AddEmailResult> {
  const response = await request<EmailAddress[]>('POST', URLs.EMAIL, { email })
  return toAddEmailResult(response)
}

export async function deleteEmail(email: string): Promise<DeleteEmailResult> {
  const response = await request<EmailAddress[]>('DELETE', URLs.EMAIL, {
    email,
  })
  return toDeleteEmailResult(response)
}

export async function markEmailAsPrimary(
  email: string
): Promise<MarkPrimaryResult> {
  const response = await request<EmailAddress[]>('PATCH', URLs.EMAIL, {
    email,
    primary: true,
  })
  return toMarkPrimaryResult(response)
}

export async function requestEmailVerification(
  email: string
): Promise<EmailVerificationResult> {
  const response = await request<null>('PUT', URLs.EMAIL, { email })
  return toEmailVerificationResult(response)
}

export async function verifyEmail(key: string): Promise<VerifyEmailResult> {
  const response = await request<AuthData>('POST', URLs.VERIFY_EMAIL, { key })
  return toVerifyEmailResult(response)
}

export async function getPasswordReset(
  key: string
): Promise<GetPasswordResetResult> {
  const response = await request<null>('GET', URLs.RESET_PASSWORD, undefined, {
    'X-Password-Reset-Key': key,
  })
  return toGetPasswordResetResult(response)
}

export async function resetPassword(
  password: string,
  key: string
): Promise<ResetPasswordResult> {
  const response = await request<AuthData>(
    'POST',
    URLs.RESET_PASSWORD,
    { password, key },
    {
      'X-Password-Reset-Key': key,
    }
  )
  return toResetPasswordResult(response)
}

export async function changePassword(
  data: unknown
): Promise<ChangePasswordResult> {
  const response = await request<null>('POST', URLs.CHANGE_PASSWORD, data)
  return toChangePasswordResult(response)
}

export async function getAuth(): Promise<GetAuthResult> {
  const response = await request<AuthData>('GET', URLs.SESSION)
  return toGetAuthResult(response)
}

export async function authenticateByToken(
  providerId: string,
  token: string,
  process: string = AUTH_PROCESS.LOGIN
): Promise<AuthenticateByTokenResult> {
  const response = await request<AuthData>('POST', URLs.PROVIDER_TOKEN, {
    provider: providerId,
    token,
    process,
  })
  return toAuthenticateByTokenResult(response)
}

export function redirectToProvider(
  providerId: string,
  callbackURL: string,
  process: string = AUTH_PROCESS.LOGIN
) {
  const payload: Record<string, string> = {
    provider: providerId,
    process,
    callback_url: callbackURL,
  }
  const csrf = getCSRFToken()
  if (csrf) {
    payload.csrfmiddlewaretoken = csrf
  }
  postForm(URLs.REDIRECT_TO_PROVIDER, payload)
}

export function authInfo(
  auth: GetAuthResult | AuthResponse | undefined,
  config: GetConfigResult | ConfigurationResponse | undefined
): AuthInfo {
  if (typeof auth === 'undefined' || config?.status !== 200) {
    return { initialised: false, isLoading: true }
  }
  // Handle session expired (410) - no auth data available
  if (auth.status === 410) {
    return {
      isAuthenticated: false,
      requiresReauthentication: false,
      user: null,
      pendingFlow: undefined,
      initialised: true,
      isLoading: false,
    }
  }
  // For 200 and 401, we have data and meta
  const meta =
    'meta' in auth
      ? (auth.meta as { is_authenticated?: boolean } | undefined)
      : undefined
  const data = 'data' in auth ? auth.data : undefined
  const isAuthenticated =
    auth.status === 200 || (auth.status === 401 && meta?.is_authenticated)
  const requiresReauthentication = Boolean(
    isAuthenticated && auth.status === 401
  )
  const pendingFlow = data?.flows?.find((flow) => flow.is_pending)
  return {
    isAuthenticated: Boolean(isAuthenticated),
    requiresReauthentication,
    user: isAuthenticated && data ? data.user : null,
    pendingFlow,
    initialised: true,
    isLoading: false,
  }
}

export function determineAuthChangeKind(
  fromAuth: GetAuthResult | AuthResponse,
  toAuth: GetAuthResult | AuthResponse,
  config: GetConfigResult | ConfigurationResponse
) {
  let fromInfo = authInfo(fromAuth, config)
  const toInfo = authInfo(toAuth, config)
  if (toAuth.status === 410) {
    return AUTH_CHANGE_KIND.LOGGED_OUT
  }
  // Corner case: user ID change. Treat as if we're transitioning from anonymous state.
  if (fromInfo.user && toInfo.user && fromInfo.user?.id !== toInfo.user?.id) {
    fromInfo = {
      isAuthenticated: false,
      requiresReauthentication: false,
      user: null,
      pendingFlow: undefined,
      initialised: fromInfo.initialised,
      isLoading: fromInfo.isLoading,
    }
  }
  if (!fromInfo.isAuthenticated && toInfo.isAuthenticated) {
    // You typically don't transition from logged out to reauthentication required.
    return AUTH_CHANGE_KIND.LOGGED_IN
  }
  if (fromInfo.isAuthenticated && !toInfo.isAuthenticated) {
    return AUTH_CHANGE_KIND.LOGGED_OUT
  }
  if (fromInfo.isAuthenticated && toInfo.isAuthenticated) {
    if (toInfo.requiresReauthentication) {
      return AUTH_CHANGE_KIND.REAUTHENTICATION_REQUIRED
    }
    if (fromInfo.requiresReauthentication) {
      return AUTH_CHANGE_KIND.REAUTHENTICATED
    }
    // Check if methods count increased (for reauthentication detection)
    const fromData = 'data' in fromAuth ? fromAuth.data : undefined
    const toData = 'data' in toAuth ? toAuth.data : undefined
    if (
      fromData?.methods &&
      toData?.methods &&
      fromData.methods.length < toData.methods.length
    ) {
      // If you do a page reload when on the reauthentication page, both fromAuth
      // and toAuth are authenticated, and it won't see the change without this.
      return AUTH_CHANGE_KIND.REAUTHENTICATED
    }
  } else if (!fromInfo.isAuthenticated && !toInfo.isAuthenticated) {
    const fromFlow = fromInfo.pendingFlow
    const toFlow = toInfo.pendingFlow
    if (toFlow?.id && fromFlow?.id !== toFlow.id) {
      return AUTH_CHANGE_KIND.FLOW_UPDATED
    }
  }
  // No change.
  return null
}
