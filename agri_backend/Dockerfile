# Use a lightweight Python base image with Python 3.12
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt to the container
COPY requirements.txt .

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Remove pywin32 from requirements.txt if it exists (Python-based approach)


# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app code into the container
COPY . .


# Collect static files (optional)
RUN python manage.py collectstatic --noinput

# Expose the port that Django (or Flask) will run on
EXPOSE 8000

# Command to run the Django server (or Flask)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
