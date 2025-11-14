"""
WSGI/ASGI entry point for production deployment
This file can be used by Gunicorn with UvicornWorker
"""
from main import app

# For Gunicorn with UvicornWorker, we just export the ASGI app
# Gunicorn will handle it with: gunicorn wsgi:app -w 4 -k uvicorn.workers.UvicornWorker
application = app

