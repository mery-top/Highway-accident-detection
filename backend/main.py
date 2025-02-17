from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
import bcrypt
import os
import serial
import threading
from dotenv import load_dotenv
# uvicorn main:app --reload

load_dotenv()

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if needed for your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Settings(BaseModel):
    authjwt_secret_key: str = os.getenv("JWT_KEY")

@AuthJWT.load_config
def get_config():
    return Settings()

# Hardcoding a bcrypt hash for testing purposes
# This is the hash of the password "hello"
STORED_PASSWORD_HASH = os.getenv("HASH_VALUE")
class LoginRequest(BaseModel):
    password: str

# Store accident data
accident_data = {
    "status": "No accident detected",
    "latitude": None,
    "longitude": None,
    "magnitude": 0.0,
    "heartbeat": 0,
    "temperature": 0.0
}

# Open serial connection (Update the port as per your system)
ser = serial.Serial('/dev/cu.wchusbserial1140', 9600, timeout=1)

def read_serial():
    """ Reads data from the Arduino serial port and updates accident_data. """
    global accident_data
    while True:
        try:
            line = ser.readline().decode('utf-8').strip()
            
            if line.startswith("Magnitude:"):
                magnitude = float(line.split(":")[1].strip())
                accident_data["magnitude"] = magnitude
            
            elif line.startswith("Heartbeat:"):
                heartbeat = int(line.split(":")[1].strip())
                accident_data["heartbeat"] = heartbeat
            
            elif line.startswith("Temperature:"):
                temperature = float(line.split(":")[1].strip())
                accident_data["temperature"] = temperature

            elif line.startswith("ACCIDENT:"):
                lat, lng = line.split(":")[1].split(",")
                accident_data["status"] = "Accident detected!"
                accident_data["latitude"] = float(lat)
                accident_data["longitude"] = float(lng)
                print("Accident Data Updated:", accident_data)

            elif line.startswith("DATA:"):
                lat, lng, heartbeat, temperature = line.split(":")[1].split(",")
                accident_data.update({
                    "status": "Accident detected!",
                    "latitude": float(lat),
                    "longitude": float(lng),
                    "heartbeat": int(heartbeat),
                    "temperature": float(temperature),
                })
                print("Updated Data:", accident_data)

        except Exception as e:
            print("Error reading serial:", e)

# Run Serial Reading in a Background Thread
serial_thread = threading.Thread(target=read_serial, daemon=True)
serial_thread.start()

@app.get("/accident-data")
def get_accident_data():
    """ API endpoint to fetch accident data """
    return accident_data


@app.post("/login")
def login(data: LoginRequest, Authorize: AuthJWT = Depends()):
    print(f"Checking entered password: {data.password}")
    print(f"Stored password hash: {STORED_PASSWORD_HASH}")

    # Checking the entered password hash against the stored hash
    if bcrypt.checkpw(data.password.encode(), STORED_PASSWORD_HASH.encode()):
        print("checking....")
        access_token = Authorize.create_access_token(subject="authenticated_user")
        print(access_token)
        return {"message": "Login successful", "token": access_token}
    else:
        raise HTTPException(status_code=401, detail="Incorrect password")

@app.get("/protected")
def protected(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        return {"message": "You have access!"}
    except:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/home")
def home(Authorize: AuthJWT = Depends()):
    try:
        # This will automatically check the JWT token in the Authorization header
        Authorize.jwt_required()
        return {"message": "Welcome to the home page!"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
