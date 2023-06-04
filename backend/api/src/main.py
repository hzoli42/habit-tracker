from fastapi import FastAPI
from routers.session.router import router as session_router
import uvicorn

app = FastAPI()
app.include_router(session_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80, log_level="info")