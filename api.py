from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import NovaXEngine

app = FastAPI()
engine = NovaXEngine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    reset: bool = False

class ChatResponse(BaseModel):
    reply: str
    history_length: int

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if req.reset:
        engine.reset()
    reply = engine.chat(req.message)
    return ChatResponse(reply=reply, history_length=len(engine.history))

@app.get("/reset")
async def reset():
    engine.reset()
    return {"status": "ok"}

@app.get("/history")
async def history():
    return {"history": engine.history}
