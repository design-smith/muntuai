import os
from dotenv import load_dotenv
import autogen
from datetime import datetime, timedelta
import json
from utils import get_current_datetime, format_datetime_for_prompt

# Load environment variables
load_dotenv()

class CalendarManager:
    def __init__(self, timezone="UTC"):
        self.schedule_file = "workspace/schedule.json"
        self.timezone = timezone
        self._ensure_schedule_file()
    
    def _ensure_schedule_file(self):
        """Ensure the schedule file exists with basic structure."""
        if not os.path.exists(self.schedule_file):
            os.makedirs(os.path.dirname(self.schedule_file), exist_ok=True)
            with open(self.schedule_file, 'w') as f:
                json.dump({
                    "events": [],
                    "last_updated": datetime.now().isoformat(),
                    "timezone": self.timezone
                }, f, indent=2)
    
    def get_schedule(self):
        """Get the current schedule."""
        with open(self.schedule_file, 'r') as f:
            return json.load(f)
    
    def save_schedule(self, schedule):
        """Save the updated schedule."""
        schedule["last_updated"] = datetime.now().isoformat()
        schedule["timezone"] = self.timezone
        with open(self.schedule_file, 'w') as f:
            json.dump(schedule, f, indent=2)
    
    def check_availability(self, start_time, duration_minutes):
        """Check if a time slot is available."""
        schedule = self.get_schedule()
        start = datetime.fromisoformat(start_time)
        end = start + timedelta(minutes=duration_minutes)
        
        for event in schedule["events"]:
            event_start = datetime.fromisoformat(event["start_time"])
            event_end = datetime.fromisoformat(event["end_time"])
            
            # Check for overlap
            if (start < event_end and end > event_start):
                return False
        return True
    
    def add_event(self, title, start_time, duration_minutes, description=""):
        """Add a new event to the schedule."""
        if not self.check_availability(start_time, duration_minutes):
            return False, "Time slot is not available"
        
        schedule = self.get_schedule()
        end_time = (datetime.fromisoformat(start_time) + 
                   timedelta(minutes=duration_minutes)).isoformat()
        
        new_event = {
            "title": title,
            "start_time": start_time,
            "end_time": end_time,
            "duration_minutes": duration_minutes,
            "description": description
        }
        
        schedule["events"].append(new_event)
        self.save_schedule(schedule)
        return True, "Event added successfully"
    
    def remove_event(self, event_title, start_time):
        """Remove an event from the schedule."""
        schedule = self.get_schedule()
        for i, event in enumerate(schedule["events"]):
            if (event["title"] == event_title and 
                event["start_time"] == start_time):
                schedule["events"].pop(i)
                self.save_schedule(schedule)
                return True, "Event removed successfully"
        return False, "Event not found"
    
    def get_events_for_date(self, date):
        """Get all events for a specific date."""
        schedule = self.get_schedule()
        target_date = datetime.fromisoformat(date).date()
        
        return [
            event for event in schedule["events"]
            if datetime.fromisoformat(event["start_time"]).date() == target_date
        ]

def get_calendar_agent(name="CalendarAssistant", timezone="EST"):
    """Returns a configured calendar agent."""
    calendar_manager = CalendarManager(timezone=timezone)
    
    # Configure the DeepSeek API
    config_list = [
        {
            "model": "deepseek-chat",
            "api_key": os.getenv("DEEPSEEK_API_KEY"),
            "base_url": "https://api.deepseek.com/v1"
        }
    ]
    
    # Get current datetime information
    datetime_info = get_current_datetime(timezone)
    datetime_context = format_datetime_for_prompt(datetime_info)
    
    # Create the calendar agent
    calendar_agent = autogen.UserProxyAgent(
        name=name,
        system_message=f"""You are {name}, a helpful calendar management assistant. 
        Your role is to help manage and organize schedules. You can:
        - Check availability for specific time slots
        - Add new events to the calendar
        - Remove events from the calendar
        - View events for specific dates
        - Provide schedule summaries
        
        Always verify availability before scheduling new events.
        Be clear and precise with time-related information.
        Confirm actions with the user before making changes.
        
        Current time context: {datetime_context}
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
    
    # Add calendar manager to the agent's context
    calendar_agent.calendar_manager = calendar_manager
    
    return calendar_agent 