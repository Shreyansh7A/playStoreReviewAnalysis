# playStoreReviewAnalysis
Take home assignment for Delhi Startup

## AI model used
gpt 4o

Create a .env file and add OPENAI_API_KEY= <your_key>


## How to run the Backend

Good practice is to create a virtual environment before installing dependencies. This avoids clash with other projects.

Install all dependencies mentioned in requirements.txt
- pip install -r requirements.txt

Start the backend via command:
- uvicorn main:app --reload --host 0.0.0.0 --port 5001

## How to run the Front End

Navigate to the frontend

Run 
- npm install
- npm run dev