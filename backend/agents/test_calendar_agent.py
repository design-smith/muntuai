from calendar_agent import get_calendar_agent
import json
from datetime import datetime, timedelta

def test_calendar_agent():
    # Create a calendar agent
    agent = get_calendar_agent()
    
    # Test adding an event
    success, message = agent.calendar_manager.add_event(
        title="Test Meeting",
        start_time="2024-03-20T10:00:00",
        duration_minutes=60,
        description="A test meeting"
    )
    print(f"Add event result: {success}, {message}")
    
    # Test getting events for a date
    events = agent.calendar_manager.get_events_for_date("2024-03-20")
    print(f"Events for date: {events}")

def interactive_test():
    # Initialize the calendar agent
    agent = get_calendar_agent(name="CalendarAssistant")
    
    print("Welcome to the Calendar Assistant! (Type 'exit' to quit)")
    print("-" * 50)
    
    while True:
        # Get user input
        user_input = input("\nYou: ").strip()
        
        # Check if user wants to exit
        if user_input.lower() == 'exit':
            print("\nGoodbye!")
            break
        
        # Get agent's response
        response = agent.generate_reply(
            messages=[{
                "role": "user",
                "content": user_input
            }],
            sender=agent
        )
        
        print(f"\nCalendar Assistant: {response}")

if __name__ == "__main__":
    # Choose which test to run
    print("Choose test mode:")
    print("1. Run predefined test requests")
    print("2. Interactive mode")
    choice = input("Enter your choice (1 or 2): ").strip()
    
    if choice == "1":
        test_calendar_agent()
    elif choice == "2":
        interactive_test()
    else:
        print("Invalid choice. Running interactive mode by default.")
        interactive_test() 