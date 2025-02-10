import bcrypt

password = "hello"
hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

print("Stored Hash:", hashed_password)
