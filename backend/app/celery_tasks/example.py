from app.celery import app as celery_app

@celery_app.task(name="execute_crew_task")
def execute_crew_task(crew_config: dict):
    """
    Execute a CrewAI task asynchronously
    """
    try:
        # Your CrewAI task execution logic here
        return {"status": "success", "result": "Task completed"}
    except Exception as e:
        return {"status": "error", "error": str(e)}
