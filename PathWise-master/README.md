# Smart Course Selector AI Agent (MVP)

This project is a basic Minimum Viable Product (MVP) for a Smart Course Selector powered by an AI agent.

## Project Structure

```
/
├── backend/
│   ├── main.py         # FastAPI application
│   └── requirements.txt # Python dependencies
├── frontend/           # HTML/CSS/JS simple frontend (deprecated)
│   ├── index.html     
│   ├── chat.html      
│   ├── styles.css     
│   └── script.js      
├── frontend-react/     # React-based frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Welcome.js     # Welcome page component
│       │   ├── Welcome.css
│       │   ├── ChatBot.js     # ChatBot component
│       │   └── ChatBot.css
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
└── README.md           # This file
```

## Getting Started

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### React Frontend (Recommended)

1.  Navigate to the `frontend-react` directory:
    ```bash
    cd frontend-react
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
    If you're having issues with npm, you can also try:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The React app will be running at `http://localhost:3000`.

### Simple HTML/CSS/JS Frontend (Alternative)

1.  Open the `frontend/index.html` file directly in your web browser.
2.  Alternatively, you can use a simple HTTP server (like Python's built-in one) from the `frontend` directory:
    ```bash
    cd frontend
    python -m http.server 8080 
    ```
    Then navigate to `http://localhost:8080` in your browser.

## Features

- Welcome page with a "Next" button that leads to the chatbot
- Chatbot interface for asking questions about courses
- Backend API with a simple AI chatbot response system

## Next Steps

*   Enhance the chatbot AI logic with more sophisticated responses
*   Load and integrate course data from a CSV or JSON file 
*   Add user profiles and personalized recommendations
*   Improve the UI/UX with more intuitive design
*   Add course details pages and navigation 