# Python 3.9 is end-of-life; use a supported runtime for google-auth and Django.
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
WORKDIR /app/src

# Static assets are immutable application files, so prepare them while building
# the image instead of delaying every container start.
RUN python manage.py collectstatic --noinput

# Apply database migrations on boot, then listen on the port assigned by the host.
CMD ["sh", "-c", "python manage.py migrate --noinput && exec gunicorn ecommerce_project.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]
