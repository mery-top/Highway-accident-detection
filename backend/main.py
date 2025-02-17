from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
import bcrypt
import os
import serial
from twilio.rest import Client
from fastapi.responses import JSONResponse
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



TWILIO_PHONE_NUMBER = "+15402534583"  # Replace with your Twilio number
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")  # Replace with your Twilio Account SID
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")  # Replace with your Twilio Auth Token

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


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




# Pydantic model for accident data
class AccidentData(BaseModel):
    latitude: float
    longitude: float
    magnitude: float
    phone_number: str
    
@app.post("/send-accident-alert")
def send_accident_alert():
    data = request.json

    if not data.get("phone_number") or not data.get("magnitude"):
        return jsonify({"error": "Missing required fields: phone_number or magnitude"}), 400

    phone_number = data["phone_number"]
    latitude = data.get("latitude", "Unknown")
    longitude = data.get("longitude", "Unknown")
    magnitude = data["magnitude"]

    # Send SMS using Twilio
    try:
        # Send an SMS alert
        message = client.messages.create(
            body=f"Accident detected! Magnitude: {magnitude}. Location: {latitude}, {longitude}.",
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number,
        )

        # Optionally, you can add a phone call for more urgency
        call = client.calls.create(
            twiml=f'<Response><Say voice="alice">Urgent! Accident detected! Magnitude {magnitude} at {latitude}, {longitude}. Please take action immediately.</Say></Response>',
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number,
        )

        return jsonify({"message": "Accident alert sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
