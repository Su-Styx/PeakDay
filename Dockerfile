# Use a lighter base image
FROM python:3.8-slim

# Install build dependencies including gcc, g++, and LAPACK
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libffi-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /django

# Copy only requirements file to leverage Docker build cache
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir --upgrade pip \
    && pip3 install --no-cache-dir -r requirements.txt gunicorn

# Copy your application code
COPY . .

# Command to run your application
CMD ["gunicorn", "PeakDay.wsgi", "--bind", "0.0.0.0:8000"]
