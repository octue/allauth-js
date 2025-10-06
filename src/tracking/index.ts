/** TODO REFACTOR REQUEST
 *
 * Day of app launch, 20 August 2025! We're getting a number of errors
 * in signups being flagged as events in vercel analytics, and want to include some
 * improved error information so we can cross-section them between errors that
 * are legitimate validation problems, versus errors that are more problematic.
 *
 * This means parsing a wide range of possible errors from allauth into primitives.
 *
 * Yes, we know this code is terrible but it's launch day and we need something urgently.
 *
 * Here be ChatGPT. It's the new Here be Dragons.
 *
 *                               ___[_-,--,-_]___
 *                         __[ -~          ~- ]__
 *         I__I         __[_-~           ,--    \]
 *        /(--)\/\/\/\ __-     / /      /        \
 *        [ 00 ] =======    __/ /      [      ]   \
 *         ~~~~            //_,,,~~~~,,,_____/    /
 *                                               /
 *                        >>~~~~~~~~~~~~~~~~~~~~~
 *
 */

type StatusOK = 200
type StatusBadRequest = 400
type StatusUnauthorized = 401
type StatusForbidden = 403
type StatusConflict = 409

export interface SignupSuccess {
  status: StatusOK
  data: {
    user: {
      id: number
      display: string
      has_usable_password: boolean
      email: string
      username: string
    }
    methods: Array<{
      method: string
      at: number
      email?: string
      provider?: string
    }>
  }
  meta: {
    is_authenticated: true
    session_token: string
    access_token: string
  }
}

export interface AllauthErrorItem {
  message: string
  code?: string
  param?: string
}

export interface SignupValidationError {
  status: StatusBadRequest
  errors: AllauthErrorItem[]
}

type Flow =
  | { id: 'login' }
  | { id: 'signup' }
  | { id: 'provider_redirect'; providers: string[] }
  | { id: 'provider_token'; providers: string[] }
  | { id: 'verify_email'; is_pending?: boolean }

export interface SignupAuthNeeded {
  status: StatusUnauthorized
  data: { flows: Flow[] }
  meta?: { is_authenticated: false }
}

export interface SignupForbidden {
  status: StatusForbidden
}
export interface SignupConflict {
  status: StatusConflict
}

export type SignupResponse =
  | SignupSuccess
  | SignupValidationError
  | SignupAuthNeeded
  | SignupForbidden
  | SignupConflict

// ==== Tracked props (flat, explicit, no generics) ====
export type SignupSucceeded200 = {
  status: 200
  outcome: 'success'
  username: string
}

export type SignupSucceeded401Verify = {
  status: 401
  outcome: 'success_pending_verification'
  verification_required: true
  flows: string // comma-separated
  providers?: string // comma-separated
  verify_email_pending?: boolean
}

export type SignupFailed400 = {
  status: 400
  outcome: 'validation_error'
  fields?: string // comma-separated
  code?: string
  message: string
}

export type SignupFailed401 = {
  status: 401
  outcome: 'auth_required'
  flows?: string
}

export type SignupFailed403 = { status: 403; outcome: 'forbidden' }
export type SignupFailed409 = { status: 409; outcome: 'conflict' }
export type SignupFailedUnknown = {
  status: number
  outcome: 'unknown_exception'
}

export type SignupTrackProps =
  | SignupSucceeded200
  | SignupSucceeded401Verify
  | SignupFailed400
  | SignupFailed401
  | SignupFailed403
  | SignupFailed409
  | SignupFailedUnknown

// ==== Formatter ====
const trunc = (s: string, n = 240) => (s.length > n ? s.slice(0, n) + '…' : s)
const uniq = <T>(xs: T[]) => Array.from(new Set(xs))

function hasVerifyEmailFlow(res: SignupAuthNeeded): boolean {
  return res.data.flows.some((f) => f.id === 'verify_email')
}

function flowIds(res: SignupAuthNeeded): string[] {
  return res.data.flows.map((f) => f.id)
}

function flowProviders(res: SignupAuthNeeded): string[] {
  return uniq(
    res.data.flows.flatMap((f) =>
      'providers' in f ? (f.providers as string[]) : []
    )
  )
}

function verifyPending(res: SignupAuthNeeded): boolean {
  return res.data.flows.some(
    (f) => f.id === 'verify_email' && (f as any).is_pending
  )
}

export function summarizeSignup(res: SignupResponse): {
  event: 'Signup succeeded' | 'Signup failed'
  props: SignupTrackProps
  summary: string
} {
  switch (res.status) {
    case 200: {
      const props: SignupSucceeded200 = {
        status: 200,
        outcome: 'success',
        username: res.data.user.username,
      }
      return {
        event: 'Signup succeeded',
        props,
        summary: `200 OK — user=${props.username}`,
      }
    }

    case 401: {
      // Treat ONLY the verify_email flow as success
      if ('data' in res && hasVerifyEmailFlow(res)) {
        const flowsList = flowIds(res).join(',')
        const providersList = flowProviders(res).join(',')
        const props: SignupSucceeded401Verify = {
          status: 401,
          outcome: 'success_pending_verification',
          verification_required: true,
          flows: flowsList,
          ...(providersList ? { providers: providersList } : {}),
          ...(verifyPending(res) ? { verify_email_pending: true } : {}),
        }
        const summary =
          `401 Verify email required — flows=${flowsList}` +
          (providersList ? ` providers=${providersList}` : '') +
          (props.verify_email_pending ? ' verify_email=pending' : '')
        return { event: 'Signup succeeded', props, summary }
      }

      // Any other 401 = failure
      const flowsList =
        'data' in res && Array.isArray(res.data.flows)
          ? res.data.flows.map((f) => f.id).join(',')
          : ''
      const props: SignupFailed401 = {
        status: 401,
        outcome: 'auth_required',
        ...(flowsList ? { flows: flowsList } : {}),
      }
      return {
        event: 'Signup failed',
        props,
        summary: `401 Auth required — flows=${flowsList || 'n/a'}`,
      }
    }

    case 400: {
      const fields = uniq(
        res.errors.map((e) => e.param).filter(Boolean) as string[]
      ).join(',')
      const code = res.errors.find((e) => e.code)?.code
      const message = trunc(res.errors.map((e) => e.message).join('; '))
      const props: SignupFailed400 = {
        status: 400,
        outcome: 'validation_error',
        ...(fields ? { fields } : {}),
        ...(code ? { code } : {}),
        message,
      }
      return {
        event: 'Signup failed',
        props,
        summary: `400 Validation — fields=${fields || 'n/a'} code=${
          code || 'n/a'
        } msg="${message}"`,
      }
    }

    case 403: {
      const props: SignupFailed403 = { status: 403, outcome: 'forbidden' }
      return {
        event: 'Signup failed',
        props,
        summary: '403 Forbidden — e.g., signup closed',
      }
    }

    case 409: {
      const props: SignupFailed409 = { status: 409, outcome: 'conflict' }
      return {
        event: 'Signup failed',
        props,
        summary: '409 Conflict — e.g., already logged in',
      }
    }

    default:
      return {
        //@ts-ignore
        props: { status: res.status, outcome: 'unknown_exception' },
        event: 'Signup failed',
        //@ts-ignore
        summary: `${res.status} Unknown Exception`,
      }
  }
}
