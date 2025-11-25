# Next.js Example - allauth-js

This is a complete example application demonstrating how to use the `allauth-js` library with Next.js and Django Allauth in headless mode.

## Features

- **Complete Authentication Flow**
  - Email/password login
  - User signup
  - Password reset
  - Email verification
  - Passwordless login (login by code)
  - Logout

- **Account Management**
  - Email address management (add, verify, remove, make primary)
  - Password change
  - Active sessions management
  - User profile settings

- **React Hooks Integration**
  - `useAuth` - Access authentication state
  - `useAuthStatus` - Get processed auth info
  - `useUser` - Access current user
  - `useEmails` - Manage email addresses
  - `useSessions` - Manage active sessions
  - `useSetErrors` - Form error handling

- **Next.js Routing Components**
  - `<AuthenticatedRoute>` - Protect authenticated routes
  - `<AnonymousRoute>` - Protect anonymous routes
  - `<AuthChangeRedirector>` - Handle auth state changes

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.11+ with uv (for the backend)
- The backend server running (see `../backend/README.md`)

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

## Quick Start

### 1. Start the Backend

First, start the Django backend server:

```bash
cd ../backend
./setup.sh
uv run python manage.py runserver
```

The backend will be available at `http://localhost:8000`.

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

The `.env.local` file is already configured for local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── pages/
│   ├── _app.tsx                    # App wrapper with AuthContextProvider
│   ├── index.tsx                   # Homepage (auth-aware)
│   └── account/
│       ├── login/
│       │   ├── index.tsx          # Login page
│       │   └── code/              # Passwordless login
│       ├── signup.tsx             # Signup page
│       ├── logout.tsx             # Logout page
│       ├── password/
│       │   ├── change.tsx         # Change password
│       │   └── reset/             # Password reset flow
│       ├── verify-email/          # Email verification
│       └── settings/
│           ├── index.tsx          # Settings overview
│           ├── emails.tsx         # Email management
│           └── sessions.tsx       # Session management
├── components/
│   ├── core/                      # Core UI components
│   ├── forms/                     # Form components
│   ├── layout/                    # Layout components
│   └── icons/                     # Icon components
└── styles/
    └── globals.css                # Global styles with Tailwind
```

## Usage Examples

### Using Authentication Hooks

```typescript
import { useAuthStatus, useUser } from "@octue/allauth-js/react"

function MyComponent() {
  const { isAuthenticated, isLoading } = useAuthStatus()
  const user = useUser()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### Protecting Routes

```typescript
import { AuthenticatedRoute } from "@octue/allauth-js/nextjs"

export default function ProtectedPage() {
  return (
    <AuthenticatedRoute>
      <div>This content is only visible to logged-in users</div>
    </AuthenticatedRoute>
  )
}
```

### Managing Emails

```typescript
import { useEmails } from "@octue/allauth-js/react"

function EmailManagement() {
  const { emails, addEmail, removeEmail, makePrimary, requestVerification } = useEmails()

  const handleAddEmail = async (email: string) => {
    await addEmail(email)
  }

  return (
    <div>
      {emails?.map(emailObj => (
        <div key={emailObj.email}>
          {emailObj.email}
          {emailObj.primary && <span>(Primary)</span>}
          {!emailObj.verified && (
            <button onClick={() => requestVerification(emailObj.email)}>
              Verify
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
```

### Form Error Handling

```typescript
import { useForm } from "react-hook-form"
import { login } from "@octue/allauth-js/core"
import { useSetErrors } from "@octue/allauth-js/react"

function LoginForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm()
  const setErrors = useSetErrors(setError)

  const onSubmit = (data) => {
    login(data).then(setErrors).catch(console.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Login</button>
    </form>
  )
}
```

## Modular Architecture

The example demonstrates the modular architecture of allauth-js:

### Core Functions (Framework Agnostic)
```typescript
import { login, logout, signUp } from "@octue/allauth-js/core"
```

### React Hooks
```typescript
import { useAuth, useUser, useEmails } from "@octue/allauth-js/react"
```

### Next.js Components
```typescript
import { AuthenticatedRoute, AnonymousRoute } from "@octue/allauth-js/nextjs"
```

### Custom Components
All UI components in this example are custom-built to demonstrate how you can create your own components using the library's hooks. You're not required to use any specific UI components - the library provides the functionality, you provide the UI.

## Available Pages

- `/` - Homepage (shows auth status)
- `/account/login` - Login page
- `/account/signup` - Signup page
- `/account/logout` - Logout confirmation
- `/account/login/code` - Request login code (passwordless)
- `/account/login/code/confirm` - Confirm login code
- `/account/password/change` - Change password (authenticated)
- `/account/password/reset` - Request password reset
- `/account/password/reset/[key]` - Reset password with key
- `/account/verify-email/[key]` - Verify email with key
- `/account/settings` - Account settings overview (authenticated)
- `/account/settings/emails` - Email management (authenticated)
- `/account/settings/sessions` - Session management (authenticated)

## Styling

This example uses:
- **Tailwind CSS v4** for styling
- **Dark mode support** via `prefers-color-scheme`
- **Responsive design** for mobile and desktop

You can easily customize the styling by modifying the component classes or using your own CSS framework.

## Building for Production

```bash
pnpm build
pnpm start
```

## Troubleshooting

### CORS Errors
If you get CORS errors, make sure:
1. The backend server is running on `http://localhost:8000`
2. Your `.env.local` has the correct `NEXT_PUBLIC_API_URL`
3. The backend CORS settings include `http://localhost:3000`

### Authentication Not Working
1. Check that the backend server is running
2. Verify the API URL in `.env.local`
3. Check the browser console for errors
4. Ensure cookies are enabled in your browser

### Email Verification Links
Email verification links will use the URLs configured in the backend's `HEADLESS_FRONTEND_URLS` setting. Make sure these match your frontend routes.

## Storybook

The `allauth-js` library includes a Storybook for developing and previewing components in isolation. Storybook is located in the **root project directory**, not in this example folder.

To run Storybook:

```bash
# From the project root (not examples/nextjs-example)
cd ../..
pnpm install
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## Learn More

- [allauth-js Documentation](../../README.md)
- [Django Allauth Documentation](https://docs.allauth.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)

## License

Same as the parent project (GPL-3.0).
