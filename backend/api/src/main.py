import os
from dotenv import load_dotenv
from fastapi import FastAPI
from mangum import Mangum
from api.src.routers.session.router import router as session_router
from api.src.routers.label.router import router as label_router

import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from api.src.config import settings

app = FastAPI(root_path=settings.root_path)


api = FastAPI()
api.include_router(session_router)
api.include_router(label_router)

app.mount("/api/v2", api)

origins = [
    "http://0.0.0.0:3000",
    "http://localhost:3000",
    "http://habit-tracker.zoltanhanesz.com"
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

handler = Mangum(app, lifespan="off")


if __name__ == "__main__":
    print(settings.env_name)
    uvicorn.run(app, host="localhost", port=5000, log_level="info")
