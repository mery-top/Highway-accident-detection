from twilio.rest import Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Twilio credentials from .env
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")  # Replace with your Twilio number
TEST_PHONE_NUMBER =os.getenv("TEST_PHONE_NUMBER")   # Replace with your actual phone number

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Send SMS
try:
    message = client.messages.create(
        body="Testing Twilio SMS! Your Twilio number is working.",
        from_=TWILIO_PHONE_NUMBER,
        to=TEST_PHONE_NUMBER,
    )
    print(f"SMS sent successfully! Message SID: {message.sid}")
except Exception as e:
    print(f"Error sending SMS: {e}")

call = client.calls.create(
    twiml='<Response><Say>Hello, this is a test call from your Twilio number!</Say></Response>',
    from_=TWILIO_PHONE_NUMBER,
    to=TEST_PHONE_NUMBER,
)

print(f"Call initiated! Call SID: {call.sid}")
