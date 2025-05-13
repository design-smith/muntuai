from datetime import datetime
import pytz

def get_current_datetime(timezone="UTC"):
    """
    Get the current datetime information for a specific timezone.
    
    Args:
        timezone (str): The timezone to get the datetime for (default: "UTC")
        
    Returns:
        dict: A dictionary containing datetime information including:
            - current_time: Current time in ISO format
            - current_date: Current date in YYYY-MM-DD format
            - timezone: The timezone used
            - weekday: The current day of the week
    """
    # Get the timezone
    tz = pytz.timezone(timezone)
    
    # Get current datetime in the specified timezone
    current_dt = datetime.now(tz)
    
    return {
        "current_time": current_dt.isoformat(),
        "current_date": current_dt.strftime("%Y-%m-%d"),
        "timezone": timezone,
        "weekday": current_dt.strftime("%A")
    }

def format_datetime_for_prompt(datetime_info):
    """
    Format datetime information into a human-readable string for prompts.
    
    Args:
        datetime_info (dict): Dictionary containing datetime information
        
    Returns:
        str: Formatted datetime string
    """
    current_dt = datetime.fromisoformat(datetime_info["current_time"])
    
    return (
        f"Current time: {current_dt.strftime('%I:%M %p')} "
        f"({datetime_info['timezone']})\n"
        f"Current date: {datetime_info['current_date']} ({datetime_info['weekday']})"
    ) 