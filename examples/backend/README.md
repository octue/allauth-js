# Minimal Django Backend with allauth-headless

This is a minimal Django backend example that demonstrates the setup required to use [django-allauth](https://docs.allauth.org/) in headless mode with the `allauth-js` library.

## Features

- **Django 5.1** with SQLite database
- **django-allauth** in headless mode
- **Email-based authentication** (username optional)
- **CORS** configured for local frontend development
- **Console email backend** (prints emails to terminal)
- **Session tracking** with allauth.usersessions

## Prerequisites

- Python 3.11 or higher
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer

Install uv if you haven't already:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Quick Start

1. **Navigate to the backend directory:**
   ```bash
   cd examples/backend
   ```

2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

   This will:
   - Install dependencies using uv
   - Create a `.env` file
   - Run database migrations
   - Optionally create a superuser
   - Configure the Site domain

3. **Start the development server:**
   ```bash
   uv run python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`.

## API Endpoints

### Allauth Headless API
`http://localhost:8000/auth/api/`

This is the main API your frontend will interact with. Available endpoints include:

- `GET /auth/api/browser/v1/auth/` - Get current authentication state
- `POST /auth/api/browser/v1/auth/login` - Login
- `POST /auth/api/browser/v1/auth/signup` - Sign up
- `DELETE /auth/api/browser/v1/auth/session` - Logout
- `POST /auth/api/browser/v1/auth/password/request` - Request password reset
- And many more...

For a complete list of endpoints, visit `/auth/api/` in your browser or see the [django-allauth headless documentation](https://docs.allauth.org/en/latest/headless/introduction.html).

### Django Admin
`http://localhost:8000/admin/`

Access the Django admin interface to manage users, email addresses, and sessions.

## Manual Setup (Alternative)

If you prefer to set up manually without the script:

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Run migrations:**
   ```bash
   uv run python manage.py migrate
   ```

4. **Create a superuser:**
   ```bash
   uv run python manage.py createsuperuser
   ```

5. **Set up the Site domain:**
   ```bash
   uv run python manage.py shell
   ```
   Then in the Python shell:
   ```python
   from django.contrib.sites.models import Site
   site = Site.objects.get(id=1)
   site.domain = 'localhost:8000'
   site.name = 'Allauth JS Example'
   site.save()
   ```

6. **Start the server:**
   ```bash
   uv run python manage.py runserver
   ```

## Configuration

### Environment Variables

Edit `.env` to customize settings:

- `DJANGO_SECRET_KEY` - Django secret key (change in production!)
- `DJANGO_DEBUG` - Enable debug mode (True/False)
- `DJANGO_ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `FRONTEND_URL` - URL of your frontend application (for CORS and redirects)

### CORS Settings

The backend is configured to accept requests from:
- `http://localhost:3000` (default Next.js port)
- `http://localhost:3001`

To add more origins, edit `config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://your-frontend-url:port",
]
```

### Email Configuration

By default, emails are printed to the console (terminal). To send real emails, update the email backend in `config/settings.py`:

```python
# For SMTP
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "your-email@gmail.com"
EMAIL_HOST_PASSWORD = "your-password"
```

## Testing with the Frontend

To test this backend with the example frontend:

1. Start the backend server (this directory):
   ```bash
   uv run python manage.py runserver
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd ../nextjs-example
   npm install
   npm run dev
   ```

3. Visit `http://localhost:3000` in your browser.

## Project Structure

```
backend/
├── config/                 # Django project configuration
│   ├── __init__.py
│   ├── settings.py        # Django settings with allauth configuration
│   ├── urls.py            # URL routing
│   ├── wsgi.py            # WSGI application
│   └── asgi.py            # ASGI application
├── manage.py              # Django management script
├── pyproject.toml         # Python dependencies (uv)
├── .env.example           # Environment variables template
├── .env                   # Your environment variables (not in git)
├── setup.sh               # Automated setup script
└── README.md              # This file
```

## Key Settings

This example uses these allauth settings:

- `ACCOUNT_AUTHENTICATION_METHOD = "email"` - Email-based login
- `ACCOUNT_EMAIL_VERIFICATION = "optional"` - Email verification is optional in dev
- `ACCOUNT_LOGIN_BY_CODE_ENABLED = True` - Passwordless login enabled
- `ACCOUNT_USERNAME_REQUIRED = False` - Username is optional

For production, you should:
- Set `ACCOUNT_EMAIL_VERIFICATION = "mandatory"`
- Use `SESSION_COOKIE_SECURE = True`
- Use `CSRF_COOKIE_SECURE = True`
- Set a strong `SECRET_KEY`
- Use a production-ready database (PostgreSQL)

## Useful Commands

```bash
# Create a new superuser
uv run python manage.py createsuperuser

# Access Django shell
uv run python manage.py shell

# Create migrations (if you add models)
uv run python manage.py makemigrations

# Run migrations
uv run python manage.py migrate

# Collect static files (for production)
uv run python manage.py collectstatic
```

## Troubleshooting

### CORS errors
If you get CORS errors in the browser console, check that:
1. Your frontend URL is in `CORS_ALLOWED_ORIGINS` in `config/settings.py`
2. The backend server is running
3. You're using the correct API URL in your frontend

### Email links not working
Email links (password reset, email verification) will use the URLs configured in `HEADLESS_FRONTEND_URLS` in `config/settings.py`. Make sure these match your frontend routes.

### Site domain issues
If redirects aren't working properly, check the Site domain:
```bash
uv run python manage.py shell
```
```python
from django.contrib.sites.models import Site
site = Site.objects.get(id=1)
print(site.domain)  # Should be 'localhost:8000'
```

## Learn More

- [django-allauth Documentation](https://docs.allauth.org/)
- [django-allauth Headless Mode](https://docs.allauth.org/en/latest/headless/introduction.html)
- [Django Documentation](https://docs.djangoproject.com/en/5.1/)
- [uv Documentation](https://github.com/astral-sh/uv)
