import os
from dotenv import load_dotenv
import autogen
from backend.agents.calendar_agent import get_calendar_agent
from backend.GraphRAG.graphrag.engine.context_builder import GraphRAGContextBuilder
from backend.GraphRAG.graphrag.engine.rag_engine import GraphRAGEngine
from composio_openai import ComposioToolSet, Action
from backend.data_services.mongo.assistant_repository import get_assistant_by_id

# Load environment variables
load_dotenv()

def build_system_prompt_from_config(config):
    name = config.get('name', 'AI Assistant')
    responsibilities = config.get('responsibilities', [])
    instructions = config.get('instructions', '')
    type_ = config.get('type', 'General')
    respond_as_me = config.get('respondAsMe', False)
    channels = config.get('channels', [])
    prompt = f"You are {name}, a helpful AI assistant of type '{type_}'.\n"
    if respond_as_me:
        prompt += "You must respond in the first person as if you are the user.\n"
    else:
        prompt += f"You must respond as yourself, '{name}', and not impersonate the user.\n"
    prompt += f"Your responsibilities include: {', '.join(responsibilities) if responsibilities else 'General assistance.'}\n"
    if instructions:
        prompt += f"Additional instructions: {instructions}\n"
    if channels:
        prompt += f"You have access to these channels: {', '.join(channels)}.\n"
    prompt += "Always confirm actions with the user before sending emails or taking actions on their behalf.\n"
    return prompt

def get_primary_agent(assistant_id=None, user_id=None, context_builder=None):
    """Returns a configured primary agent that can delegate tasks, using assistant config from MongoDB."""
    assistant_config = None
    if assistant_id:
        assistant_config = get_assistant_by_id(assistant_id)
        if not assistant_config:
            raise ValueError("Assistant not found")
        if user_id and str(assistant_config.get('user_id')) != str(user_id):
            raise ValueError("Unauthorized: Assistant does not belong to user")
        if not assistant_config.get('isActive', True):
            raise ValueError("Assistant is inactive and cannot be used.")
        name = assistant_config.get('name', 'AI Assistant')
        system_message = build_system_prompt_from_config(assistant_config)
    else:
        name = "Rose"
        system_message = "You are Rose, a helpful AI assistant that can handle various tasks and delegate to specialized agents when needed.\n\nYou have access to a Calendar Assistant for scheduling tasks and email tools for managing emails.\n\nYour primary role is to handle all user requests directly. For email-related tasks, you can:\n- Fetch new emails\n- Read and summarize emails\n- Draft responses to emails\n- Send emails after user approval\n\nAlways confirm actions with the user before sending emails."

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
    # Initialize GraphRAG engine and context builder if not provided
    if context_builder is None:
        graph_rag_engine = GraphRAGEngine()
        context_builder = GraphRAGContextBuilder(graph_rag_engine)

    # Initialize Composio ToolSet
    toolset = ComposioToolSet()

    # Fetch email-related tools
    email_tools = toolset.get_tools(actions=[
        Action.GMAIL_FETCH_EMAILS,
        Action.GMAIL_SEND_EMAIL
    ])

    # Create the primary agent
    primary_agent = autogen.UserProxyAgent(
        name=name,
        system_message=system_message,
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

    # Add calendar agent, context builder, and email tools to the primary agent's context
    primary_agent.calendar_agent = calendar_agent
    primary_agent.context_builder = context_builder
    primary_agent.email_tools = email_tools
    primary_agent.assistant_config = assistant_config

    return primary_agent

def process_request(agent, request, user_id="user1", assistant_id=None):
    """Process a user request through the primary agent, using context builder and assistant config."""
    # Get context from GraphRAG
    context = agent.context_builder.format_for_agent(query=request, user_id=user_id, agent_type="primary")
    # Add assistant config to system message if available
    system_context = f"Relevant context:\n{context['summary']}"
    if hasattr(agent, 'assistant_config') and agent.assistant_config:
        system_context += f"\nAssistant configuration:\n"
        for k, v in agent.assistant_config.items():
            if k not in ["_id", "user_id", "created_at", "updated_at"]:
                system_context += f"- {k}: {v}\n"
    # Get the primary agent's response, including context summary and config
    response = agent.generate_reply(
        messages=[{
            "role": "user",
            "content": request
        }, {
            "role": "system",
            "content": system_context
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
        # Forward the request to the calendar agent, including context
        calendar_context = agent.context_builder.format_for_agent(
            query=request, user_id=user_id, agent_type="calendar"
        )
        calendar_response = agent.calendar_agent.generate_reply(
            messages=[{
                "role": "user",
                "content": request
            }, {
                "role": "system",
                "content": f"Relevant context:\n{calendar_context['summary']}"
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

def handle_email_tasks(agent, task, user_id="user1"):
    """Handle email-related tasks like fetching, reading, and drafting responses."""
    if task == "fetch_emails":
        # Use the GMAIL_FETCH_EMAILS tool to fetch new emails
        response = agent.email_tools[0].execute()
        return response

    elif task == "draft_response":
        # Draft a response to an email
        email_content = "Provide the email content here."
        draft = agent.generate_reply(
            messages=[{
                "role": "user",
                "content": f"Draft a response to this email: {email_content}"
            }],
            sender=agent
        )
        return draft

    elif task == "send_email":
        # Use the GMAIL_SEND_EMAIL tool to send an email
        email_data = {
            "recipient": "recipient@example.com",
            "subject": "Subject of the email",
            "body": "Body of the email"
        }
        response = agent.email_tools[1].execute(params=email_data)
        return response

    return "Task not recognized."