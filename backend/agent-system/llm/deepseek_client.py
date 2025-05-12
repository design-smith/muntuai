import os
import aiohttp
from dotenv import load_dotenv

load_dotenv()

class DeepSeekClient:
    """Client for DeepSeek API."""
    def __init__(self, model="deepseek-chat"):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        if not self.api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables.")
        self.model = model
        self.base_url = "https://api.deepseek.com/v1/chat/completions"

    async def generate(self, messages, temperature=0.7, max_tokens=1000):
        """Generate a response from the DeepSeek API."""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(self.base_url, headers=headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"DeepSeek API error: {error_text}")
                result = await response.json()
                return result["choices"][0]["message"]["content"] 