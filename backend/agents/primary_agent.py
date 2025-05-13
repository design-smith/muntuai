import os
from dotenv import load_dotenv
import autogen
from calendar_agent import get_calendar_agent

# Load environment variables
load_dotenv()

def get_primary_agent(name="Rose"):
    """Returns a configured primary agent that can delegate tasks."""
    
    # Configure the DeepSeek API
    config_list = [
        {
            "model": "deepseek-chat",
            "api_key": os.getenv("DEEPSEEK_API_KEY"),
            "base_url": "https://api.deepseek.com/v1"
        }
    ]
    
    # Initialize the calendar agent
    calendar_agent = get_calendar_agent()
    
    # Create the primary agent
    primary_agent = autogen.UserProxyAgent(
        name=name,
        system_message=f"""You are {name}, a helpful AI assistant that can handle various tasks and delegate to specialized agents when needed.
        
        You have access to a Calendar Assistant that can help with scheduling and time management tasks.
        
        Your primary role is to handle all user requests directly. However, when a request specifically requires calendar operations, you should:
        1. Acknowledge the request
        2. Delegate ONLY the calendar operation to the Calendar Assistant
        3. Process the Calendar Assistant's response
        4. Present the information back to the user in a clear and helpful way
        
        Examples of when to delegate to Calendar Assistant:
        - When user wants to schedule a new event
        - When user wants to check their availability
        - When user wants to view their calendar
        - When user wants to modify or delete calendar events
        
        Examples of when to handle the request yourself:
        - General questions and conversations
        - Non-calendar related tasks
        - Requests that only mention time but don't involve calendar operations
        - Requests that need your general knowledge or assistance
        
        Always maintain control of the conversation and ensure smooth transitions between different types of requests.
        """,
        llm_config={
            "config_list": config_list,
            "temperature": 0.7,
        },
        human_input_mode="NEVER",
        code_execution_config={
            "use_docker": False,
            "last_n_messages": 3,
            "work_dir": "workspace"
        }
    )
    
    # Add calendar agent to the primary agent's context
    primary_agent.calendar_agent = calendar_agent
    
    return primary_agent

def process_request(agent, request):
    """Process a user request through the primary agent."""
    # Get the primary agent's response
    response = agent.generate_reply(
        messages=[{
            "role": "user",
            "content": request
        }],
        sender=agent
    )
    
    # Check if the response indicates a need for calendar operations
    calendar_keywords = [
        "schedule", "calendar", "meeting", "appointment", 
        "availability", "event", "booking"
    ]
    
    # Only delegate if the response clearly indicates a calendar operation
    if any(keyword in response.lower() for keyword in calendar_keywords):
        # Forward the request to the calendar agent
        calendar_response = agent.calendar_agent.generate_reply(
            messages=[{
                "role": "user",
                "content": request
            }],
            sender=agent.calendar_agent
        )
        
        # Process the calendar response and maintain context
        final_response = agent.generate_reply(
            messages=[
                {
                    "role": "user",
                    "content": request
                },
                {
                    "role": "assistant",
                    "content": f"Calendar Assistant's response: {calendar_response}"
                }
            ],
            sender=agent
        )
        return final_response
    
    return response 