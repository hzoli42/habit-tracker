import os
from dotenv import load_dotenv
from fastapi import FastAPI
from mangum import Mangum
from api.src.routers.session.router import router as session_router
from api.src.routers.label.router import router as label_router

import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from api.src.config import settings

app = FastAPI()


api_v1 = FastAPI()
api_v1.include_router(session_router)
api_v1.include_router(label_router)

app.mount("/api/v1", api_v1)

origins = [
    "http://0.0.0.0:3000",
    "http://localhost:3000",
    "http://habit-tracker.zoltanhanesz.com"
]

api_v1.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    print(settings.env_name)
    uvicorn.run(app, host="localhost", port=5000, log_level="info")
