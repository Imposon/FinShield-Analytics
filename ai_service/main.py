from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/score")
def get_score(amount: float):
    return {"risk_score": random.uniform(0, 100)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
