# Render Deployment - Start Command

## For Render.com Deployment

Use this start command in your Render service settings:

```bash
gunicorn wsgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 2 --timeout 30
```

Or if you prefer to use `main:app` directly:

```bash
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 2 --timeout 30
```

## Important Notes:

1. **$PORT**: Render automatically sets the PORT environment variable - always use `$PORT` instead of a fixed port number
2. **-k uvicorn.workers.UvicornWorker**: Required for FastAPI (ASGI) applications
3. **--workers 2**: Adjust based on your plan (2 is good for free tier)
4. **--timeout 30**: Request timeout in seconds

## Environment Variables to Set in Render:

- `DATABASE_URL`: Your PostgreSQL database URL (Render provides this if using Render PostgreSQL)
- `SECRET_KEY`: A secure random string (use `openssl rand -hex 32` to generate)
- `CORS_ORIGINS`: Your frontend URL(s), comma-separated
- `ALGORITHM`: `HS256` (default)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: `30` (default)

## Build Command:

```bash
pip install -r requirements.txt
```

## Health Check Path:

Set to: `/health`

