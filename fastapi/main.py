from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
import uvicorn

from routes import router as api_router  # Will be created from your routes.ts equivalent

app = FastAPI()

# CORS (optional, add origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for timing and logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    path = request.url.path
    method = request.method
    status_code = response.status_code
    log_line = f"{method} {path} {status_code} in {int(duration * 1000)}ms"
    if len(log_line) > 80:
        log_line = log_line[:79] + "…"
    logging.info(log_line)
    return response

# Register API routes
app.include_router(api_router, prefix="/api")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}")
    return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)
