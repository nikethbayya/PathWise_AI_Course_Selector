# PathWise AI Course Selector

The PathWise AI Course Selector is a full-stack application that combines a React front-end with a FastAPI backend to provide personalized course recommendations and career guidance. 
The backend communicates with a Language Model (LLM) pipeline (implemented in FinalCode.py) using LangChain, OpenAI, and other utilities. This project aims to assist students in selecting courses that align with 
their career goals and preferences.

## Project Structure

```
PathWise-master
├── backend/
│   ├── Finalcode.py  
│   ├── main.py
│   ├── ml_requirements.txt     
│   └── requirements.txt    
├── frontend-react/     
│   ├── public/
│   │    ├── index.html
│   │    ├── manifest.json
│   └── src/
│       ├── components/
│       │   ├── Botmessage.js   
│       │   ├── CourseScroll.js
│       │   ├── ChatBot.js    
│       │   └── ChatBot.css
│       │   ├── Courses.css   
│       │   ├── Courses.js
│       │   ├── EnrolledCourses.css   
│       │   └── EnrolledCourses.js
│       │   ├── Layout.css 
│       │   ├── Layout.js
│       │   ├── Welcome.css  
│       │   └── Welcome.js
│       ├── context/   
│       │   └── ChatContext.js
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
│       └── reportWebVitals.js
├── package-lock.json
└── package.json
└── README.md          
```

## Getting Started

### Requirements
* Python 3.8+
* Node.js 14+ and npm
* OpenAI API Key and Tavily API Key
* Additional dependencies as listed in backend/requirements.txt and frontend/package.json

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
4.  Configure Environment Variables:
   
    Create a .env file (or set environment variables) in the backend folder with the necessary API keys and settings. For example:
    ```text
    OPENAI_API_KEY=your_openai_api_key
    TAVILY_API_KEY=your_tavily_api_key
    USER_AGENT=YourAppName/1.0
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

## Usage
Open your browser and navigate to http://localhost:3000.

Use the navigation to access the chatbot page.

Interact with the chatbot by typing your query in the provided field.

The chatbot will communicate with the FastAPI endpoint (/api/chat), which in turn calls the LLM pipeline to generate responses. 
Course recommendations and career guidance will be displayed in the chat interface.

## Troubleshooting
### API Communication:
Verify that the FastAPI server is running and available at http://localhost:8000.
Check that the endpoint paths in your React app (e.g., in ChatBot.js) match your backend endpoints.
Ensure CORS is properly configured on the backend to allow your React app to communicate.
### Console Errors:
Open your browser’s console and check for any JavaScript errors.
Verify that all context values are properly imported and used.
### Environment Variables:
Make sure all required API keys are set either in your .env file or as system environment variables.
