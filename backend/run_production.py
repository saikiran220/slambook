#!/usr/bin/env python3
"""
Production run script using Gunicorn with Uvicorn workers
"""
import subprocess
import sys
import os

# Change to backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Gunicorn command with Uvicorn worker
cmd = [
    sys.executable, "-m", "gunicorn",
    "main:app",
    "-c", "gunicorn_config.py",
]

if __name__ == "__main__":
    print("Starting Slam Book API with Gunicorn + Uvicorn workers...")
    print(f"Command: {' '.join(cmd)}")
    subprocess.run(cmd)

