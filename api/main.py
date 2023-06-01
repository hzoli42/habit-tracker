from fastapi import FastAPI
from pymongo import MongoClient
import datetime
from api.routers.session.router import router as session_router

app = FastAPI()
app.include_router(session_router)


# connection_string = "mongodb+srv://hzoli42:COJYnwYB6adsMfUf@hzoli42habittracker.dau5pmq.mongodb.net/?retryWrites=true&w=majority"
# client = MongoClient(connection_string)
# db = client.habit_tracker
# sessions = db.sessions
# session_document = {
#     "user": "zolika",
#     "actions": [
#         {"timestamp": f"{datetime.datetime.now().timestamp()}", "action": "start"},
#         {"timestamp": f"{datetime.datetime.now().timestamp()}", "action": "pause"},
#         {"timestamp": f"{datetime.datetime.now().timestamp()}", "action": "stop"},
#     ]
# }
# sessions.insert_one(session_document)
# print(sessions.find_one({ "user": "zolika" }))

