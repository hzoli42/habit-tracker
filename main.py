from pymongo import MongoClient
import datetime

if __name__ == "__main__":
    connection_string = "mongodb+srv://hzoli42:COJYnwYB6adsMfUf@hzoli42habittracker.dau5pmq.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(connection_string)
    db = client.habit_tracker
    sessions = db.sessions
    session_document = {
        "user": "zolika",
        "actions": [
            {"timestamp": f"{datetime.datetime.now().timestamp()}", "action": "start"},
            {"timestamp": f"{datetime.datetime.now().timestamp()}", "action": "pause"},
            {"timestamp": f"{datetime.datetime.now().timestamp()}", "action": "stop"},
        ]
    }
    sessions.insert_one(session_document)
    print(sessions.find_one({ "user": "zolika" }))

