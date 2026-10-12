from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# initializing fastapi 
app = FastAPI(
    title="Lucid-ML API",
    description="Backend engine for XAI",
    version="1.0.0",
)

# Configuring CORS       
origins = [
    "http://localhost:5173",   # default server for vite local server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Only allow requests from our React dev server, No wildcards
    allow_credentials=True, # Allow cookies headers if needed
    allow_methods=["*"],    # Allow all HTTP methods 
    allow_headers=["*"],    # Allow all request headers
)

# Verification to check if backend is running lol
@app.get("/api/v1/health")
async def health_check():
    """
    Asynchronous health check endpoint to verify backend status.
    """
    return {
        "status": "active",
        "system": "Lucid-ML Backend Engine",
        "version": "1.0.0"
    }