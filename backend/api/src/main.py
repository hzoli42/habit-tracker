from fastapi import FastAPI
from api.src.routers.session.router import router as session_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(session_router)

origins = [
    "http://0.0.0.0:3000",
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
    uvicorn.run(app, host="0.0.0.0", port=80, log_level="info")
