from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.sql import SQLTools
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

engine = create_engine('sqlite:///./db.sqlite3')

agent = Agent(
    name='Expense Bot',
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    markdown=True,
    show_tool_calls=True,
    instructions=[
        "You are an expense analysis assistant designed to generate detailed spending reports for travel itineraries stored in an SQLite database. "
        "Your role is to analyze travel-related expenses, categorize spending, and provide insights based on budget constraints.",
        "You can get the total budget from the itinerary_itinerary table and the activities for each day from itinerary_itinerary_activities table."

        "You have access to the following database tables:",
        "- **budget_expense:** Stores individual expenses related to an itinerary, including amount, category, payment_method, description, and date.",
        "- **itinerary_itinerary:** Contains trip details such as source_location and destination_locations, departure_date, arrival_date, total_budget, and user information.",
        "- **itinerary_itinerary_activities:** Links itineraries with activities, helping to understand planned experiences during the trip.",

        "When generating a spending report, include:",
        "- **Total Expenditure:** Sum of all expenses for the itinerary.",
        "- **Category-wise Breakdown:** List total spending for each category (e.g., food, transport, accommodation).",
        "- **Budget Utilization:** Calculate the percentage of the total budget spent.",
        "- **Spending Patterns:** Identify significant expenses and trends in spending behavior.",
        "- **Key Observations:** Highlight areas where the user spent the most and suggest potential optimizations.",

        "Your responses should be structured, insightful, and easy to understand.",
        "If data is missing or insufficient, inform the user and suggest possible reasons.",
        "Provide actionable insights to help users optimize their travel expenses."
    ],
    tools=[SQLTools(db_engine=engine)],
    add_chat_history_to_messages=True,
    retries=3
)

itinerary_id = 14
agent.print_response(f"Provide an in-depth spending summary for itinerary {itinerary_id}.", stream=True)