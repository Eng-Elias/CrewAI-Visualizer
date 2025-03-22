import os
from celery import Celery

# Get environment variables with defaults
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = os.getenv('REDIS_PORT', '6379')
REDIS_DB = os.getenv('REDIS_DB', '0')

# Construct Redis URL
CELERY_BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
CELERY_RESULT_BACKEND = CELERY_BROKER_URL

# Initialize Celery
app = Celery(
    "crew_ai_tasks",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["app.celery_tasks.example"]
)

# Optional configurations
app.conf.update(
    task_serializer=os.getenv('CELERY_TASK_SERIALIZER', 'json'),
    accept_content=[os.getenv('CELERY_ACCEPT_CONTENT', 'json')],
    result_serializer=os.getenv('CELERY_RESULT_SERIALIZER', 'json'),
    timezone=os.getenv('CELERY_TIMEZONE', 'UTC'),
    enable_utc=os.getenv('CELERY_ENABLE_UTC', 'True').lower() == 'true',
    task_track_started=True,
    task_time_limit=int(os.getenv('CELERY_TASK_TIME_LIMIT', '3600')),  # 1 hour default
    worker_prefetch_multiplier=int(os.getenv('CELERY_WORKER_PREFETCH_MULTIPLIER', '1')),
)
