from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Annotated
from datetime import datetime
from sqlalchemy.orm import Session
import models, utils
# from fastapi import status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import timedelta, timezone, datetime
from database import engine, SessionLocal  

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

SECRET_KEY = "Ug?10976491"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    gender: str
    dob: str
    phone_number: str
    email: EmailStr
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
# Dependency for DB session
db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/register")
def register_user(user: UserCreate, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exist")
    
    try:
        dob_date = datetime.strptime(user.dob, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    
    # Hash the password
    hashed_password = utils.hash_password(user.password)

    # Create a new User instance
    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        gender=user.gender,
        dob=dob_date,
        phone_number=user.phone_number,
        email=user.email,
        hashed_password=hashed_password,
    )

    # Save to DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully!", "user_id": new_user.id}


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/login")
def login(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "first_name": user.first_name  # Add this!
    } 