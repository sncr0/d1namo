from fastapi import FastAPI
from api.routes import router  # Import routes
from api.glucose import glucose_router

app = FastAPI()

# Include all route handlers
app.include_router(router)
app.include_router(glucose_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
