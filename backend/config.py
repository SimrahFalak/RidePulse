from dotenv import load_dotenv
import os

load_dotenv()  # reads your .env file

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "RidePulse") 