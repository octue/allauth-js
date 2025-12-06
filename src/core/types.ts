import type { AUTHENTICATOR_KIND } from './constants'

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

export type AuthenticatorKind =
  (typeof AUTHENTICATOR_KIND)[keyof typeof AUTHENTICATOR_KIND]

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
  types?: AuthenticatorKind[]
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
      method: 'password' | 'password_reset'
      at: number
      email?: string
      username?: string
    }
  | {
      method: 'code'
      at: number
      email?: string
      phone?: string
    }
  | {
      method: 'mfa'
      at: number
      id?: number
      type?: AuthenticatorKind
      reauthenticated?: boolean
    }
  | {
      method: 'socialaccount'
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
  type: 'totp'
}

export interface RecoveryCodesAuthenticator extends BaseAuthenticator {
  type: 'recovery_codes'
  total_code_count: number
  unused_code_count: number
}

export interface SensitiveRecoveryCodesAuthenticator
  extends RecoveryCodesAuthenticator {
  unused_codes: string[]
}

export interface WebAuthnAuthenticator extends BaseAuthenticator {
  type: 'webauthn'
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

export interface URLConfig {
  login?: string
  loginRedirect?: string
  logoutRedirect?: string
}

export interface ConfigurationResponseData {
  account?: Record<string, unknown>
  socialaccount?: Record<string, unknown>
  mfa?: Record<string, unknown>
  usersessions?: Record<string, unknown>
  urls?: URLConfig
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

/** Return type for the authInfo() function */
export interface AuthInfo {
  initialised: boolean
  /** Convenience property: equivalent to !initialised */
  isLoading: boolean
  isAuthenticated?: boolean
  requiresReauthentication?: boolean
  user?: User | null
  pendingFlow?: Flow
}

// Simple empty response used for endpoints that return no structured data in 'data'
export type EmptyResponse = ApiResponse<null>

// ============================================================================
// Discriminated Union Result Types
// These provide exhaustive type checking for API responses
// ============================================================================

/** Helper to enforce exhaustive switch statements */
export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`)
}

// Base result components
export type SuccessResult<T> = { status: 200; ok: true; data: T }
export type ValidationError = { status: 400; ok: false; errors: ErrorItem[] }
export type AuthRequired = {
  status: 401
  ok: false
  reason: 'authentication_required' | 'reauthentication_required'
}
export type RateLimited = { status: 403; ok: false; reason: 'rate_limited' }
export type Conflict = { status: 409; ok: false; reason: 'conflict' }
export type TooManyRequests = {
  status: 429
  ok: false
  reason: 'too_many_requests'
}

// Email verification: PUT /account/email → 200, 400, 403, 429
export type EmailVerificationResult =
  | SuccessResult<null>
  | ValidationError
  | RateLimited
  | TooManyRequests

// Add email: POST /account/email → 200, 400, 401, 409, 429
export type AddEmailResult =
  | SuccessResult<EmailAddress[]>
  | ValidationError
  | AuthRequired
  | Conflict
  | TooManyRequests

// Delete email: DELETE /account/email → 200, 400, 429
export type DeleteEmailResult =
  | SuccessResult<EmailAddress[]>
  | ValidationError
  | TooManyRequests

// Mark primary: PATCH /account/email → 200, 400, 429
export type MarkPrimaryResult =
  | SuccessResult<EmailAddress[]>
  | ValidationError
  | TooManyRequests

// ============================================================================
// Auth Flow Result Components
// These preserve AuthData for routing on 401 responses
// ============================================================================

/** Successful authentication - user is logged in */
export type AuthSuccess = {
  status: 200
  ok: true
  data: AuthData
  meta: AuthenticatedMeta
}

/**
 * Auth flow required - not fully authenticated but has pending flows.
 * The data contains flows array for routing to appropriate next step.
 * meta.is_authenticated can be true if this is a reauthentication requirement.
 */
export type AuthFlowRequired = {
  status: 401
  ok: false
  data: AuthData
  meta: AuthenticationMeta
}

/** Session expired or invalid */
export type SessionExpired = {
  status: 410
  ok: false
  reason: 'session_expired'
}

/** Signup/login forbidden (e.g., signup closed) */
export type Forbidden = {
  status: 403
  ok: false
  reason: 'forbidden'
}

/** Resource not found */
export type NotFound = {
  status: 404
  ok: false
  reason: 'not_found'
}

// ============================================================================
// Auth Endpoint Results
// ============================================================================

// Login: POST /auth/login → 200, 400, 401, 409
export type LoginResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Conflict

// Signup: POST /auth/signup → 200, 400, 401, 403, 409
export type SignupResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Forbidden
  | Conflict

// Get session: GET /auth/session → 200, 401, 410
export type GetAuthResult = AuthSuccess | AuthFlowRequired | SessionExpired

// Logout: DELETE /auth/session → 401
export type LogoutResult = AuthFlowRequired

// Reauthenticate: POST /auth/reauthenticate → 200, 400
export type ReauthenticateResult = AuthSuccess | ValidationError

// ============================================================================
// Password Reset Results
// ============================================================================

// Request password reset: POST /auth/password/request → 200, 400, 401
export type RequestPasswordResetResult =
  | SuccessResult<null>
  | ValidationError
  | AuthFlowRequired

// Get password reset info: GET /auth/password/reset → 200, 400, 409
export type GetPasswordResetResult =
  | SuccessResult<null>
  | ValidationError
  | Conflict

// Reset password: POST /auth/password/reset → 200, 400, 401, 409
export type ResetPasswordResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Conflict

// Change password: POST /account/password/change → 200, 400, 401
export type ChangePasswordResult =
  | SuccessResult<null>
  | ValidationError
  | AuthRequired

// ============================================================================
// Login by Code Results
// ============================================================================

// Request login code: POST /auth/code/request → 400, 401
export type RequestLoginCodeResult = ValidationError | AuthFlowRequired

// Confirm login code: POST /auth/code/confirm → 200, 400, 401, 409
export type ConfirmLoginCodeResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Conflict

// ============================================================================
// Email Verification Results (key-based)
// ============================================================================

// Email verification info returned by GET /auth/email/verify
export interface EmailVerificationInfo {
  email: string
  user: User
}

// Get email verification info: GET /auth/email/verify → 200, 400, 409
export type GetEmailVerificationResult =
  | SuccessResult<EmailVerificationInfo>
  | ValidationError
  | Conflict

// Verify email: POST /auth/email/verify → 200, 400, 401, 409
export type VerifyEmailResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Conflict

// ============================================================================
// Provider/Social Auth Results
// ============================================================================

// Get provider accounts: GET /account/providers → 200
export type GetProviderAccountsResult = SuccessResult<ProviderAccount[]>

// Disconnect provider: DELETE /account/providers → 200, 400
export type DisconnectProviderResult =
  | SuccessResult<ProviderAccount[]>
  | ValidationError

// Authenticate by token: POST /auth/provider/token → 200, 400, 401, 403
export type AuthenticateByTokenResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Forbidden

// Provider signup: POST /auth/provider/signup → 200, 400, 401, 403, 409
export type ProviderSignupResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired
  | Forbidden
  | Conflict

// ============================================================================
// MFA/2FA Results
// ============================================================================

// MFA authenticate: POST /auth/2fa/authenticate → 200, 400, 401
export type MfaAuthenticateResult =
  | AuthSuccess
  | ValidationError
  | AuthFlowRequired

// MFA reauthenticate: POST /auth/2fa/reauthenticate → 200, 400
export type MfaReauthenticateResult = AuthSuccess | ValidationError

// Get authenticators: GET /account/authenticators → 200, 401, 410
export type GetAuthenticatorsResult =
  | SuccessResult<AuthenticatorList>
  | AuthRequired
  | SessionExpired

// Get TOTP authenticator: GET /account/authenticators/totp → 200, 404, 409
export type GetTOTPAuthenticatorResult =
  | SuccessResult<TOTPAuthenticator>
  | NotFound
  | Conflict

// Activate TOTP: POST /account/authenticators/totp → 200, 400, 401, 409
export type ActivateTOTPResult =
  | SuccessResult<TOTPAuthenticator>
  | ValidationError
  | AuthRequired
  | Conflict

// Deactivate TOTP: DELETE /account/authenticators/totp → 200, 401
export type DeactivateTOTPResult =
  | SuccessResult<AuthenticatorList>
  | AuthRequired

// Get recovery codes: GET /account/authenticators/recovery-codes → 200, 401, 404
export type GetRecoveryCodesResult =
  | SuccessResult<SensitiveRecoveryCodesAuthenticator>
  | AuthRequired
  | NotFound

// Generate recovery codes: POST /account/authenticators/recovery-codes → 200, 400, 401
export type GenerateRecoveryCodesResult =
  | SuccessResult<SensitiveRecoveryCodesAuthenticator>
  | ValidationError
  | AuthRequired

// ============================================================================
// Sessions Results
// ============================================================================

// Get sessions: GET /auth/sessions → 200
export type GetSessionsResult = SuccessResult<Session[]>

// End sessions: DELETE /auth/sessions → 200, 401
export type EndSessionsResult = SuccessResult<Session[]> | AuthRequired

// ============================================================================
// Email Management Results (already defined above, but adding get)
// ============================================================================

// Get email addresses: GET /account/email → 200
export type GetEmailAddressesResult = SuccessResult<EmailAddress[]>

// ============================================================================
// Config Results
// ============================================================================

// Get config: GET /config → 200
export type GetConfigResult = SuccessResult<ConfigurationResponseData>

// Event type dispatched when authentication state changes
export type AuthChangeEvent<T = unknown> = CustomEvent<ApiResponse<T>>

// Event contents object (the initializer) which is { detail: msg }
export type AuthChangeEventContents<T = unknown> = {
  detail: ApiResponse<T>
}
