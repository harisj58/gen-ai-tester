from fastapi import FastAPI, Request
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")


@app.get("/")
async def root():
    return {"message": "Welcome to the server of Gen AI Tester!"}


@app.post("/chat")
async def get_response(req: Request):
    payload = await req.json()

    # craft a barebone response template
    resp = {
        "headers": {"Content-Type": "application/json"},
        "body": {
            "statusCode": 200,  # indicate OK by default
            "message": "",
        },
    }

    messages = payload.get("messages", [])
    prompt = payload.get("prompt", "")

    if not prompt:
        resp["body"]["statusCode"] = 400
        resp["body"]["errorMessage"] = "Please supply the prompt"

        return json.loads(json.dumps(resp, default=str))

    try:
        print(messages)
        chat = model.start_chat(history=messages)
        response = await chat.send_message_async(prompt)

        resp["body"]["message"] = response.text
        return json.loads(json.dumps(resp, default=str))
    except Exception as e:
        resp["body"]["errorMessage"] = e.with_traceback(e.__traceback__)

    return json.loads(json.dumps(resp, default=str))
