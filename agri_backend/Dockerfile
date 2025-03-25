# Use lightweight Conda base
FROM continuumio/miniconda3

# Set working directory
WORKDIR /app

# Copy environment.yml and install dependencies
COPY environment.yml .
RUN conda env create -f environment.yml

# Make sure conda env is always activated
SHELL ["conda", "run", "-n", "agri", "/bin/bash", "-c"]

# Copy app code
COPY . .

# Expose Django/Flask port
EXPOSE 8000
