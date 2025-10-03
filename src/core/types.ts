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
