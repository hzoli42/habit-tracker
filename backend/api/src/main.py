from fastapi import FastAPI
from api.src.routers.session.router import router as session_router
from api.src.routers.user.router import router as user_router

import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(session_router)
app.include_router(user_router)

origins = [
    "http://0.0.0.0:3000",
    "http://habit-tracker:3000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5000, log_level="info")
