import os
from dotenv import load_dotenv
import autogen

# Load environment variables
load_dotenv()

def get_intent_classifier_agent():
    """Returns a configured intent classifier agent."""
    config_list = [
        {
            "model": "deepseek-chat",
            "api_key": os.getenv("DEEPSEEK_API_KEY"),
            "base_url": "https://api.deepseek.com/v1"
        }
    ]

    intent_classifier = autogen.AssistantAgent(
        name="Intent_Classifier",
        system_message="""You are an intent classifier. Your job is to classify user messages into one of three categories:
1. basic - For general conversation, greetings, small talk, and simple queries that don't require external data
2. search - For queries that require searching through user's data, documents, or need factual information
3. calendar - For any scheduling, meeting, or calendar-related requests

Respond with ONLY ONE of these words: basic, search, or calendar.

Examples:
- "Hello, how are you?" -> basic
- "What's my work experience?" -> search
- "Schedule a meeting" -> calendar
- "Tell me about my skills" -> search
- "What's the weather like?" -> basic
- "Set up a call" -> calendar""",
        llm_config={
            "config_list": config_list,
            "temperature": 0.1,  # Low temperature for consistent classification
        }
    )

    return intent_classifier

def classify_intent(classifier, message: str, context: dict = None) -> str:
    """
    Classify the intent of a user message.
    
    Args:
        classifier: The intent classifier agent
        message: The user's message
        context: Optional context information
    
    Returns:
        str: The classified intent (basic, search, or calendar)
    """
    # Prepare the classification request
    classification_request = f"Classify this message: {message}"
    if context and context.get('history'):
        classification_request += f"\n\nRecent conversation history:\n{context['history']}"

    # Get classification from the agent
    response = classifier.generate_reply(
        messages=[{
            "role": "user",
            "content": classification_request
        }],
        sender=classifier
    )

    # Clean and validate the response
    intent = response.strip().lower()
    valid_intents = ['basic', 'search', 'calendar']
    
    # If response isn't one of our valid intents, default to basic
    if intent not in valid_intents:
        return 'basic'
        
    return intent 