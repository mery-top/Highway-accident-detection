from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
import bcrypt
import os
from dotenv import load_dotenv


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
    authjwt_secret_key: str = "your_secret_key"  

@AuthJWT.load_config
def get_config():
    return Settings()

# Hardcoding a bcrypt hash for testing purposes
# This is the hash of the password "hello"
STORED_PASSWORD_HASH = os.getenv("HASH_VALUE")
class LoginRequest(BaseModel):
    password: str

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
