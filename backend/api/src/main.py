from fastapi import FastAPI
from api.src.routers.session.router import router as session_router
from api.src.routers.user.router import router as user_router

import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

api_v1 = FastAPI()
api_v1.include_router(session_router)
api_v1.include_router(user_router)

app.mount("/api/v1", api_v1)

origins = [
    "http://0.0.0.0:3000",
    "http://habit-tracker:3000",
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
    uvicorn.run(app, host="localhost", port=5000, log_level="info")
