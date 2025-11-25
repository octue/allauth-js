#!/bin/bash
set -e

echo "🚀 Setting up minimal Django backend with allauth-headless..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ Error: uv is not installed. Please install it first:"
    echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Install dependencies using uv
echo "📦 Installing dependencies with uv..."
uv sync

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Run migrations
echo "🗄️  Running database migrations..."
uv run python manage.py migrate

# Create superuser automatically
echo "👤 Creating superuser..."
uv run python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    print('✅ Superuser created successfully!')
else:
    print('ℹ️  Superuser already exists.')
EOF

# Set up the Site object
echo "🌐 Setting up Site domain..."
uv run python manage.py shell << EOF
from django.contrib.sites.models import Site
site = Site.objects.get(id=1)
site.domain = 'localhost:8000'
site.name = 'Allauth JS Example'
site.save()
print(f'Site configured: {site.domain}')
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔑 Admin credentials:"
echo "  Username: admin"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "To start the development server, run:"
echo "  uv run python manage.py runserver"
echo ""
echo "The API will be available at:"
echo "  http://localhost:8000/auth/api/"
echo "  http://localhost:8000/admin/"
