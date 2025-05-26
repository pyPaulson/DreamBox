# backend/models.py

from sqlalchemy import Column, Integer, String, Date
from database import Base

class User(Base):
    __tablename__ = "users"  

    id = Column(Integer, primary_key=True, index=True)  
    first_name = Column(String, nullable=False)        
    last_name = Column(String, nullable=False)          
    gender = Column(String, nullable=False)             
    dob = Column(Date, nullable=False)                  
    phone_number = Column(String, nullable=False, unique=True)  
    email = Column(String, unique=True, index=True, nullable=False)  
    hashed_password = Column(String, nullable=False)    
