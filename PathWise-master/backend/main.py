import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Enable CORS (adjust allowed origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global conversation state (for demo purposes only)
conversation_state = {}

# Pydantic model for chat requests
class ChatRequest(BaseModel):
    query: str

def get_client_id(request: Request) -> str:
    # Use client's IP address as a simple identifier
    return request.client.host

# Import your LLM workflow function from finalcode.py
from Finalcode import process_request

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Course Selector Backend (FastAPI)!"}

@app.post("/chat")
async def chat_endpoint(request: Request, chat: ChatRequest):
    client_id = get_client_id(request)
    user_input = chat.query.strip()

    # If no conversation state exists, initialize and ask for University ID.
    if client_id not in conversation_state:
        conversation_state[client_id] = {"state": "awaiting_id", "data": {}}
        return {"response": "Welcome! What is your University ID?"}

    state_data = conversation_state[client_id]
    current_state = state_data["state"]

    if current_state == "awaiting_id":
        if user_input:
            state_data["data"]["student_id"] = user_input
            state_data["state"] = "awaiting_enrollment"
            response = "Thank you! Please enter your enrollment type (Enter '1' for full-time or '2' for part-time)."
        else:
            response = "Please provide your University ID."
    elif current_state == "awaiting_enrollment":
        if user_input == "1":
            state_data["data"]["enrollment"] = "fulltime"
        elif user_input == "2":
            state_data["data"]["enrollment"] = "parttime"
        else:
            return {"response": "Invalid input. Please enter '1' for full-time or '2' for part-time."}
        state_data["state"] = "awaiting_career_goal"
        response = "Great. Now, please tell me your career goal (e.g., Data Scientist, AI Engineer, etc.)."
    elif current_state == "awaiting_career_goal":
        state_data["data"]["career_goal"] = user_input
        state_data["state"] = "awaiting_time_slot"
        response = "Thanks. What is your preferred time slot (e.g., 2:30 PM)?"
    elif current_state == "awaiting_time_slot":
        state_data["data"]["time_slot"] = user_input
        state_data["state"] = "awaiting_preferred_domain"
        response = "Almost there! What is your preferred domain (e.g., Machine Learning, Data Science)?"
    elif current_state == "awaiting_preferred_domain":
        state_data["data"]["preferred_domain"] = user_input
        collected_data = state_data["data"]

        # Now, call your LLM workflow to generate recommendations.
        # Build the input state as expected by your LLM model.
        student_input_for_llm = {"keys": collected_data}
        result = process_request(student_input_for_llm)
        
        # Clear conversation state as the session is complete.
        conversation_state.pop(client_id, None)
        
        response = (
            "Thank you for providing all your details.\n\n"
            f"Course Recommendations:\n{result.get('course_recommendations', 'No recommendations generated.')}\n\n"
            f"Career Guidance:\n{result.get('career_guidance', 'No guidance generated.')}"
        )
    else:
        conversation_state.pop(client_id, None)
        response = "Let's start over. What is your University ID?"

    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
