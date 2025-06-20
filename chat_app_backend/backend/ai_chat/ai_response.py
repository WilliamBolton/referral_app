import time
import requests
from openai import OpenAI

async def get_ai_response(message_text):
    """Generates response from OpenAI assistant"""
    # OpenAI API key
    api_key = "" #API removed for confidentiality

    # OpenAI Model
    assistant_id = "" #id removed for confidentiality

    # Create client
    client = OpenAI(api_key=api_key)

    # Create thred with message
    thread = client.beta.threads.create(
    messages=[
        {
        "role": "user",
        "content": message_text,
        }
    ]
    )
    print(f"OpenAI thread {thread.id}")

    # Submit the thread to the assistant
    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=assistant_id)
    print(f"OpenAI run created {run.id}")
    while run.status != "completed":
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        print('run.status:', run.status)
        time.sleep(2)

    message_response = client.beta.threads.messages.list(thread_id=thread.id)
    message_response_data = message_response.data
    latest_response = message_response_data[0]
    print(f"Final AI response: {latest_response.content[0].text.value}")
    return(latest_response.content[0].text.value)