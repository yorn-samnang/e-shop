# Use Python 3.9 as base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app/src

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "src/ecommerce_project.wsgi:application"]
