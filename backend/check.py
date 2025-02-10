import bcrypt

password = "your-secret-key"
hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

print("Stored Hash:", hashed_password)
