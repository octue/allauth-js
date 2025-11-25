# allauth-js

Common JS funcitons, React hooks and components for [django-allauth](https://docs.allauth.org/) headless mode.

Build authentication flows in JS/React/Next.js applications backed by django-allauth's battle-tested authentication system.

**Features:**
- Common JS functions for interacting with allauth's headless API
- Fully typed library
- React hooks for auth state, user data, emails, and sessions
- Route guards for protected and anonymous pages
- Full support for email/password, passwordless, and social auth
- Pre-built UI components with Tailwind CSS styling
- Fully customisable - start with pre-built then copy the components out to cutsomise or build your own.

## Installation

```bash
npm install @octue/allauth-js
# or
pnpm add @octue/allauth-js
```

**Peer dependencies:** React 18+ (for react hooks and components), Next.js 15+ (for route guards)

## Quick Start

### 1. Wrap your app with AuthContextProvider

```tsx
// pages/_app.tsx or app/layout.tsx
import { AuthContextProvider } from '@octue/allauth-js/react'

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider
      urls={{
        login: '/login',
        loginRedirect: '/dashboard',
        logoutRedirect: '/',
      }}
    >
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}
```

### 2. Set up styling

**Option A: Tailwind CSS (recommended)**

Add the library to your Tailwind content paths and set the `allauth` color scale to match your branding:

```css
/* Tailwind v4 - globals.css */
@import "tailwindcss";
@source "../node_modules/@octue/allauth-js/dist/**/*.{js,mjs}";

@theme inline {
  --color-allauth-50: #F1CFDA;
  --color-allauth-100: #ECBFCE;
  --color-allauth-200: #E2A0B6;
  --color-allauth-300: #D9819E;
  --color-allauth-400: #CF6186;
  --color-allauth-500: #C6426E;
  --color-allauth-600: #A03055;
  --color-allauth-700: #75233E;
  --color-allauth-800: #4A1627;
  --color-allauth-900: #1E0910;
  --color-allauth-950: #090305;
}
```

For Tailwind v3, use the preset:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,tsx}',
    './node_modules/@octue/allauth-js/dist/**/*.{js,mjs}',
  ],
  presets: [require('@octue/allauth-js/tailwind-preset')],
}
```

**Option B: Pre-compiled CSS**

If you're not using Tailwind, import (or redefine yourself) the pre-compiled styles:

```tsx
import '@octue/allauth-js/styles.css'
```

### 3. Use hooks and components

```tsx
import { useUser, useAuthStatus } from '@octue/allauth-js/react'
import { login, logout } from '@octue/allauth-js/core'

function Profile() {
  const { isAuthenticated } = useAuthStatus()
  const { user, loading } = useUser()

  if (!isAuthenticated) {
    return <button onClick={() => login({ email, password })}>Log in</button>
  }

  if (loading) return <div>Loading user details...</div>

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}
```

## Usage Examples

### Login Form

```tsx
import { useForm } from 'react-hook-form'
import { login } from '@octue/allauth-js/core'
import { Button, useSetErrors } from '@octue/allauth-js/react'
import { AnonymousRoute } from '@octue/allauth-js/nextjs'

function LoginForm() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm()
  const setErrors = useSetErrors(setError)

  const onSubmit = (data) => {
    login(data).then(setErrors)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" placeholder="Email" />
      <input {...register('password')} type="password" placeholder="Password" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  )
}

// Wrap with AnonymousRoute to redirect authenticated users
export default function LoginPage() {
  return (
    <AnonymousRoute>
      <LoginForm />
    </AnonymousRoute>
  )
}
```

### Protected Route

```tsx
import { AuthenticatedRoute } from '@octue/allauth-js/nextjs'
import { useUser } from '@octue/allauth-js/react'

function DashboardContent() {
  const { user } = useUser()
  return <h1>Welcome back, {user?.email}</h1>
}

export default function Dashboard() {
  return (
    <AuthenticatedRoute>
      <DashboardContent />
    </AuthenticatedRoute>
  )
}
```

### Email & Session Management

```tsx
import { useEmails, useSessions, EmailsTable, SessionsTable } from '@octue/allauth-js/react'
import { AuthenticatedRoute } from '@octue/allauth-js/nextjs'

function SettingsPage() {
  const { emails, add, remove, makePrimary, verify, loading: emailsLoading } = useEmails()
  const { currentSession, otherSessions, endSessions, trackActivity, loading: sessionsLoading } = useSessions()

  return (
    <div>
      <h2>Email Addresses</h2>
      <EmailsTable
        emails={emails}
        add={add}
        remove={remove}
        makePrimary={makePrimary}
        verify={verify}
        disabled={emailsLoading}
      />

      <h2>Active Sessions</h2>
      <SessionsTable
        currentSession={currentSession}
        otherSessions={otherSessions}
        endSessions={endSessions}
        trackActivity={trackActivity}
        disabled={sessionsLoading}
      />
    </div>
  )
}

export default function Settings() {
  return (
    <AuthenticatedRoute>
      <SettingsPage />
    </AuthenticatedRoute>
  )
}
```

## API Reference

### Hooks (`@octue/allauth-js/react`)

| Hook | Purpose |
|------|---------|
| `useUser()` | Get current user and loading state |
| `useAuthStatus()` | Get auth status (isAuthenticated, isLoading, pendingFlow) |
| `useEmails()` | Manage user email addresses |
| `useSessions()` | Manage active sessions |
| `useConfig()` | Get backend configuration |
| `useAuthChange()` | Detect auth state changes |
| `useSetErrors()` | Map API errors to react-hook-form |

### Components (`@octue/allauth-js/react`)

| Component | Purpose |
|-----------|---------|
| `AuthContextProvider` | Wrap app to provide auth context |
| `Button` | Styled button with color palettes |
| `EmailsTable` | Email management table |
| `SessionsTable` | Session management table |
| `EmailsTableSkeleton` | Loading skeleton for emails |
| `SessionsTableSkeleton` | Loading skeleton for sessions |

### Core Functions (`@octue/allauth-js/core`)

| Function | Purpose |
|----------|---------|
| `login(data)` | Authenticate with email/password |
| `logout()` | End current session |
| `signUp(data)` | Create new account |
| `changePassword(data)` | Change password |
| `requestPasswordReset(email)` | Start password reset flow |
| `resetPassword(password, key)` | Complete password reset |
| `requestLoginCode(email)` | Request passwordless login code |
| `confirmLoginCode(code)` | Confirm passwordless login |
| `getAuth()` | Get current auth state |

### Route Guards (`@octue/allauth-js/nextjs`)

| Component | Purpose |
|-----------|---------|
| `AuthenticatedRoute` | Redirect to login if not authenticated |
| `AnonymousRoute` | Redirect to dashboard if already authenticated |

## Development

### Running the Example App

The repository includes a full Next.js example with Django backend.

**Prerequisites:** Node.js 18+, pnpm, Python 3.11+, uv

```bash
# 1. Start the Django backend
cd examples/backend
./setup.sh
uv run python manage.py runserver

# 2. Start the Next.js frontend (new terminal)
cd examples/nextjs-example
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Test credentials: username `admin` / password `admin123`

See [`examples/nextjs-example/README.md`](examples/nextjs-example/README.md) for detailed example documentation.

### Storybook

Preview components in isolation:

```bash
pnpm install
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## License

allauth-js is GPLv3 licensed and completely free for open-source use on codebases with compliant licenses.

For commercial closed source use, we have a [simple, low-cost, one-off payment perpetual license](https://buy.stripe.com/cNi9AM2TY0x0eSfcI6b3q00) to help support the high cost of maintaining open-source software. Go through the payment process and we'll send a filled out license.

For other license options (eg you want to redistribute or use in open-source but non GPL-compatible projects) please contact us.
