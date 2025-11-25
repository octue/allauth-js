"""
URL configuration for minimal allauth-headless example.
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Django admin interface
    path("admin/", admin.site.urls),
    # Allauth URLs - required even in headless mode for OAuth handshake
    path("auth/", include("allauth.urls")),
    # Allauth Headless API - the main API for your frontend
    path("auth/api/", include("allauth.headless.urls")),
]
