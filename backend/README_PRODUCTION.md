# Production Deployment Guide

## Running with Gunicorn (Production)

FastAPI uses ASGI (Asynchronous Server Gateway Interface), not WSGI. To use Gunicorn with FastAPI, you need to use the `UvicornWorker`.

### Option 1: Using Gunicorn Config File

```bash
cd backend
gunicorn main:app -c gunicorn_config.py
```

Or:

```bash
python run_production.py
```

### Option 2: Direct Gunicorn Command

```bash
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Option 3: Using wsgi.py

```bash
cd backend
gunicorn wsgi:application -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Gunicorn Parameters

- `-w 4` or `--workers 4`: Number of worker processes (typically 2-4 x CPU cores)
- `-k uvicorn.workers.UvicornWorker`: Use UvicornWorker for ASGI support
- `--bind 0.0.0.0:8000`: Bind address and port
- `--timeout 30`: Worker timeout in seconds
- `--access-logfile -`: Log access logs to stdout
- `--error-logfile -`: Log error logs to stderr
- `--log-level info`: Logging level

## Environment Variables

Set these in your production environment:

```bash
export GUNICORN_WORKERS=4
export GUNICORN_BIND="0.0.0.0:8000"
export GUNICORN_LOG_LEVEL="info"
export DATABASE_URL="postgresql://user:password@localhost:5432/slambook_db"
export SECRET_KEY="your-production-secret-key"
```

## Production Checklist

- [ ] Set secure `SECRET_KEY` in environment
- [ ] Configure PostgreSQL database (not SQLite)
- [ ] Set appropriate CORS origins
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up SSL/TLS certificates
- [ ] Configure logging
- [ ] Set up process management (systemd/supervisor)
- [ ] Configure firewall rules
- [ ] Set up monitoring and health checks

## Systemd Service Example

Create `/etc/systemd/system/slam-book-api.service`:

```ini
[Unit]
Description=Slam Book API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn main:app -c gunicorn_config.py

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable slam-book-api
sudo systemctl start slam-book-api
```

