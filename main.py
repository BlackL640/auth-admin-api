import os
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Auth & Admin Management API",
    version="1.0.0",
    description="Dedicated microservice for User Authentication and Admin Operations"
)

# --- Pydantic Schemas ---
class DietitianRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    qualification: str

class ClientRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    gender: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AdminApproval(BaseModel):
    user_id: int
    approved: bool

class BranchCreate(BaseModel):
    name: str
    location: str


# --- Endpoints ---
@app.get("/health", tags=["Health Check"])
@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "status": "healthy",
        "service": "Auth & Admin Management API"
    }

@app.post("/register/dietitian", tags=["Auth & Admin"])
def register_dietitian(data: DietitianRegister):
    return {"message": "Dietitian registered successfully", "data": data}

@app.post("/register/client", tags=["Auth & Admin"])
def register_client(data: ClientRegister):
    return {"message": "Client registered successfully", "data": data}

@app.post("/login", tags=["Auth & Admin"])
def login(data: LoginRequest):
    return {"token": "access_token_example", "token_type": "bearer"}

@app.get("/admin/approvals", tags=["Auth & Admin"])
def get_admin_approvals():
    return {"pending_approvals": []}

@app.post("/admin/approvals", tags=["Auth & Admin"])
def process_approval(data: AdminApproval):
    return {"message": f"User {data.user_id} approval status updated to {data.approved}"}

@app.post("/branches", tags=["Auth & Admin"])
def create_branch(data: BranchCreate):
    return {"message": "Branch created successfully", "branch": data.name}

@app.get("/branches", tags=["Auth & Admin"])
def list_branches():
    return {"branches": []}