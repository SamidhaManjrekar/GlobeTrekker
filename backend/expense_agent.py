from typing import List, Dict, Any
import json
from rich.pretty import pprint
from pydantic import BaseModel, Field
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini
from phi.tools.sql import SQLTools
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

engine = create_engine('sqlite:///./db.sqlite3')
 

# Define the Spending Report model
class SpendingReport(BaseModel):
    destination_location: str = Field(..., description="The destination of the trip.")
    total_expenditure: float = Field(..., description="Total amount spent on this trip.")
    budget_utilization: str = Field(..., description="Percentage of total budget used.")
    category_breakdown: Dict[str, float] = Field(..., description="Breakdown of expenses by category (e.g., food, transport).")
    day_wise_breakdown: Dict[str, float] = Field(..., description="Breakdown of expenses by date.")
    spending_patterns: List[str] = Field(..., description="Key spending trends and behaviors.")
    key_observations: List[str] = Field(..., description="Major observations and possible optimization suggestions.")
    
# Agent to fetch data from the database
data_agent = Agent(
    name="Data Agent",
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    markdown=True,
    # show_tool_calls=True, 
    structured_outputs=True, 
    instructions=[
        "You are a data retrieval agent responsible for fetching relevant financial data from an SQLite database.",
        "Extract total budget, departure date(the date the users leaves for the trip), arrival date(the date the user returns from the trip), and the destination location from the `itinerary_itinerary` table, expenses from the `budget_expense` table and the activities per day from the itinerary_itinerary_activities table.",
        "Ensure data integrity and format it properly before passing it to the report agent.",
        "Here are the relevant table schemas:",
        "",
        "1. `itinerary_itinerary` (stores itinerary details):",
        "   - `id` (INTEGER, PRIMARY KEY) - Unique identifier for the itinerary.",
        "   - `destination_location` (TEXT) - Destination of the itinerary.",
        "   - `total_budget` (REAL) - The total allocated budget for the trip.",
        "",
        "2. `budget_expense` (stores individual expenses for an itinerary):",
        "   - `id` (INTEGER, PRIMARY KEY) - Unique identifier for the expense record.",
        "   - `itinerary_id` (INTEGER, FOREIGN KEY) - The associated itinerary.",
        "   - `category` (TEXT) - Category of expense (e.g., transport, food, accommodation).",
        "   - `amount` (REAL) - Amount spent in this category.",
        "   - `date` (DATE) - Date of the spending.",
        "",
        "Use these schemas to retrieve structured financial data effectively.",
        "Pass the total amount spent, day wise spending and category wise spending to the report agent."
    ],
    tools=[SQLTools(db_engine=engine)],
    retries=3
)

# Agent to generate a detailed report based on the retrieved data
report_agent = Agent(
    name="Report Agent",
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    markdown=True,
    show_tool_calls=True,
    response_model=SpendingReport,
    instructions=[
        "You are a financial report assistant responsible for analyzing received from the data_agent and generating a detailed spending report.",
        "Your input will be raw financial data fetched by the Data Agent.",
        "Provide clear insights, spending patterns, and budget utilization details.",
        "Ensure accuracy and clarity in your response.",
        "The report should not mention anything about the data being wrong."
    ],
    retries=3
)

# Team Agent to manage the process
team_agent = Agent(
    name="Team Agent",
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    markdown=True,
    show_tool_calls=True,
    structured_outputs=True,
    instructions=[
        "You are the team manager coordinating between the Data Agent and Report Agent.",
        "Your role is to ensure the Data Agent fetches the correct information and passes it to the Report Agent for analysis.",
        "Ensure that both agents communicate effectively and produce a high-quality spending report.",
    ],
    retries=3
)

# Run the multi-agent workflow
itinerary_id = 14

# Step 1: Data Agent fetches relevant financial data
data_response = data_agent.run(f"Retrieve all relevant financial data for itinerary {itinerary_id}.")
financial_data = data_response.content  # Extract structured data

# Step 2: Report Agent processes the retrieved data
report_response = report_agent.run(f"Analyze the following financial data and generate a spending report:\n{json.dumps(financial_data, indent=4)}")
report_json = report_response.content  # Extract structured report

# Step 3: Team Agent oversees the process
team_agent.run("Verify the accuracy and quality of the spending report generated.")

# Print the final spending report
print(report_json)