"""
Django settings for minimal allauth-headless example.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-example-key-change-in-production",
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# Application definition
INSTALLED_APPS = [
    # Django core apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",  # Required for allauth
    # Third-party apps
    "corsheaders",  # Required for frontend communication
    "allauth",  # Required
    "allauth.account",  # Required
    "allauth.usersessions",  # Required for session tracking
    "allauth.headless",  # Required for headless mode
    "allauth.socialaccount",  # Optional: for social auth
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # Must be before CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",  # Required for allauth
    "allauth.usersessions.middleware.UserSessionsMiddleware",  # Required
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",  # Required for allauth
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==============================================================================
# AUTHENTICATION SETTINGS
# ==============================================================================

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

# ==============================================================================
# ALLAUTH SETTINGS
# ==============================================================================

# Required for allauth
SITE_ID = 1

# Frontend URL for redirects
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# Account settings
ACCOUNT_LOGIN_METHODS = {"email"}  # Use email for authentication
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*"]  # Email and password (no confirmation)
ACCOUNT_EMAIL_VERIFICATION = "optional"  # Use "mandatory" in production
ACCOUNT_LOGIN_BY_CODE_ENABLED = True  # Enable passwordless login
ACCOUNT_LOGOUT_ON_PASSWORD_CHANGE = False
ACCOUNT_PRESERVE_USERNAME_CASING = False

# Redirect URLs
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = FRONTEND_URL
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = FRONTEND_URL
ACCOUNT_LOGOUT_REDIRECT_URL = FRONTEND_URL
ACCOUNT_SIGNUP_REDIRECT_URL = FRONTEND_URL

# Headless frontend URLs (required for email links)
HEADLESS_FRONTEND_URLS = {
    "account_confirm_email": f"{FRONTEND_URL}/account/verify-email/{{key}}",
    "account_reset_password": f"{FRONTEND_URL}/account/password/reset",
    "account_reset_password_from_key": f"{FRONTEND_URL}/account/password/reset/{{key}}",
    "account_signup": f"{FRONTEND_URL}/account/signup",
    "socialaccount_login_error": f"{FRONTEND_URL}/account/provider/callback",
}

# User sessions tracking
USERSESSIONS_TRACK_ACTIVITY = True

# ==============================================================================
# CORS SETTINGS
# ==============================================================================

from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = (
    *default_headers,
    "x-email-verification-key",  # Custom header for allauth
    "x-password-reset-key",  # Custom header for allauth
)
CORS_ALLOW_CREDENTIALS = True  # Required for session-based auth

# Allowed origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# ==============================================================================
# SESSION & CSRF SETTINGS
# ==============================================================================

SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 86400  # 1 day

CSRF_COOKIE_SECURE = False  # Set to True in production
CSRF_USE_SESSIONS = False  # Frontend needs to read csrftoken cookie

# ==============================================================================
# EMAIL SETTINGS
# ==============================================================================

# Console backend prints emails to terminal
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "noreply@example.com"
