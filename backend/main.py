from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router  # Import routes
from api.glucose import glucose_router
from api.chatbot import chatbot_router

app = FastAPI()

# Include all route handlers
app.include_router(router)
app.include_router(glucose_router)
app.include_router(chatbot_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
