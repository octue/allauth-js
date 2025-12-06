import { ACCEPT_JSON, AUTH_CHANGE_KIND, AUTH_PROCESS } from './constants'
import { getCSRFToken } from './csrf'
import { URLs } from './urls'
import type {
  ApiResponse,
  AuthChangeEventContents,
  AuthData,
  AuthenticatorListResponse,
  AuthInfo,
  AuthResponse,
  ConfigurationResponse,
  EmailAddressesResponse,
  EmptyResponse,
  ProviderAccountsResponse,
  RecoveryCodesResponse,
  SessionsResponse,
  TOTPAuthenticatorResponse,
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

export async function login(data: unknown): Promise<AuthResponse> {
  return await request('POST', URLs.LOGIN, data)
}

export async function reauthenticate(data: unknown): Promise<AuthResponse> {
  return await request('POST', URLs.REAUTHENTICATE, data)
}

export async function logout(): Promise<AuthResponse> {
  return await request('DELETE', URLs.SESSION)
}

export async function signUp<T extends Record<string, unknown>>(
  data: T
): Promise<AuthResponse> {
  return await request('POST', URLs.SIGNUP, data)
}

export async function providerSignup(data: unknown): Promise<AuthResponse> {
  return await request('POST', URLs.PROVIDER_SIGNUP, data)
}

export async function getProviderAccounts(): Promise<ProviderAccountsResponse> {
  return await request('GET', URLs.PROVIDERS)
}

export async function disconnectProviderAccount(
  providerId: string,
  accountUid: string
): Promise<ProviderAccountsResponse> {
  return await request('DELETE', URLs.PROVIDERS, {
    provider: providerId,
    account: accountUid,
  })
}

export async function requestPasswordReset(
  email: string
): Promise<EmptyResponse> {
  return await request('POST', URLs.REQUEST_PASSWORD_RESET, { email })
}

export async function requestLoginCode(email: string): Promise<EmptyResponse> {
  return await request('POST', URLs.REQUEST_LOGIN_CODE, { email })
}

export async function confirmLoginCode(code: string): Promise<EmptyResponse> {
  return await request('POST', URLs.CONFIRM_LOGIN_CODE, { code })
}

export async function getEmailVerification(
  key: string
): Promise<EmptyResponse> {
  return await request('GET', URLs.VERIFY_EMAIL, undefined, {
    'X-Email-Verification-Key': key,
  })
}

export async function getEmailAddresses(): Promise<EmailAddressesResponse> {
  return await request('GET', URLs.EMAIL)
}

export async function getSessions(): Promise<SessionsResponse> {
  return await request('GET', URLs.SESSIONS)
}

export async function endSessions(
  ids: (string | number)[]
): Promise<SessionsResponse> {
  return await request('DELETE', URLs.SESSIONS, { sessions: ids })
}

export async function getAuthenticators(): Promise<AuthenticatorListResponse> {
  return await request('GET', URLs.AUTHENTICATORS)
}

export async function getTOTPAuthenticator(): Promise<TOTPAuthenticatorResponse> {
  return await request('GET', URLs.TOTP_AUTHENTICATOR)
}

export async function mfaAuthenticate(code: string): Promise<AuthResponse> {
  return await request('POST', URLs.MFA_AUTHENTICATE, { code })
}

export async function mfaReauthenticate(code: string): Promise<AuthResponse> {
  return await request('POST', URLs.MFA_REAUTHENTICATE, { code })
}

export async function activateTOTPAuthenticator(
  code: string
): Promise<TOTPAuthenticatorResponse> {
  return await request('POST', URLs.TOTP_AUTHENTICATOR, { code })
}

export async function deactivateTOTPAuthenticator(): Promise<AuthenticatorListResponse> {
  return await request('DELETE', URLs.TOTP_AUTHENTICATOR)
}

export async function getRecoveryCodes(): Promise<RecoveryCodesResponse> {
  return await request('GET', URLs.RECOVERY_CODES)
}

export async function generateRecoveryCodes(): Promise<RecoveryCodesResponse> {
  return await request('POST', URLs.RECOVERY_CODES)
}

export async function getConfig(): Promise<ConfigurationResponse> {
  return await request('GET', URLs.CONFIG)
}

export async function addEmail(email: string): Promise<EmailAddressesResponse> {
  return await request('POST', URLs.EMAIL, { email })
}

export async function deleteEmail(
  email: string
): Promise<EmailAddressesResponse> {
  return await request('DELETE', URLs.EMAIL, { email })
}

export async function markEmailAsPrimary(
  email: string
): Promise<EmailAddressesResponse> {
  return await request('PATCH', URLs.EMAIL, { email, primary: true })
}

export async function requestEmailVerification(
  email: string
): Promise<EmptyResponse> {
  return await request('PUT', URLs.EMAIL, { email })
}

export async function verifyEmail(key: string): Promise<EmptyResponse> {
  return await request('POST', URLs.VERIFY_EMAIL, { key })
}

export async function getPasswordReset(key: string): Promise<EmptyResponse> {
  return await request('GET', URLs.RESET_PASSWORD, undefined, {
    'X-Password-Reset-Key': key,
  })
}

export async function resetPassword(
  password: string,
  key: string
): Promise<EmptyResponse> {
  return await request(
    'POST',
    URLs.RESET_PASSWORD,
    { password, key },
    {
      'X-Password-Reset-Key': key,
    }
  )
}

export async function changePassword(data: unknown): Promise<EmptyResponse> {
  return await request('POST', URLs.CHANGE_PASSWORD, data)
}

export async function getAuth(): Promise<AuthResponse> {
  return await request<AuthData>('GET', URLs.SESSION)
}

export async function authenticateByToken(
  providerId: string,
  token: string,
  process: string = AUTH_PROCESS.LOGIN
): Promise<AuthResponse> {
  return await request('POST', URLs.PROVIDER_TOKEN, {
    provider: providerId,
    token,
    process,
  })
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
  auth: AuthResponse | undefined,
  config: ConfigurationResponse | undefined
): AuthInfo {
  if (typeof auth === 'undefined' || config?.status !== 200) {
    return { initialised: false, isLoading: true }
  }
  const meta = auth.meta as { is_authenticated?: boolean } | undefined
  const isAuthenticated =
    auth.status === 200 || (auth.status === 401 && meta?.is_authenticated)
  const requiresReauthentication = Boolean(
    isAuthenticated && auth.status === 401
  )
  const pendingFlow = auth.data?.flows?.find((flow) => flow.is_pending)
  return {
    isAuthenticated: Boolean(isAuthenticated),
    requiresReauthentication,
    user: isAuthenticated && auth.data ? auth.data.user : null,
    pendingFlow,
    initialised: true,
    isLoading: false,
  }
}

export function determineAuthChangeKind(
  fromAuth: AuthResponse,
  toAuth: AuthResponse,
  config: ConfigurationResponse
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
    //@ts-ignore
    if (fromAuth.data.methods.length < toAuth.data.methods.length) {
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
