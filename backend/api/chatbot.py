import base64
from io import BytesIO
import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
import random
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.prebuilt import create_react_agent
import requests
from dotenv import load_dotenv
import os
import re
import plotly.graph_objects as go
import pandas as pd

from api.glucose import GlucoseReading, get_sample_prediction_heavy, get_sample_prediction_medium, get_sample_prediction_light,get_sample_current

load_dotenv()
chatbot_router = APIRouter(prefix="/chatbot", tags=["Chatbot"])
USDA_API_KEY = os.getenv("USDA_API_KEY")

prompt = """You are a nutritional assistant specializing in breaking down meals into individual ingredients with their quantities and providing their nutritional information.
If the user asks for meal recommendations, assist with them based on the previous response, and analyze the meals with the provided tools.
When a user describes their meal, follow these steps:

1. Ingredient Parsing:
  - Extract distinct ingredients and their quantities from the meal description.
  - If the user provides a dish name (e.g., "chicken alfredo pasta"), infer common ingredients (e.g., "chicken breast, alfredo sauce, pasta, parmesan cheese").
  - Correct minor spelling mistakes in ingredient names.
  - If the meal is vague, ask for clarification (e.g., "What type of sandwich? Turkey and cheese or peanut butter and jelly?").
  - If quantity is not given, assume it is 100g. Do not ask for clarification.
  - Example: "I ate 250g chicken, 150g pasta, and 50g alfredo sauce." will be parsed into ["250g chicken", "150g pasta", "50g alfredo sauce"].
2. Fetching Nutritional Data:
  - Use the get_nutri_data tool to retrieve nutritional values for each ingredient.
  - If an ingredient is unavailable, provide the closest match based on the USDA FoodData Central database.
3. Summarizing the Nutritional Content:
  - Calculate the total nutritional values by summing up calories, protein, fat, and carbohydrates for all ingredients.
  - Present the data in an easy-to-understand format.
  - Optionally, include a breakdown of each ingredient’s contribution.
4. Predict if the meal will cause increase in glucose:
  - Use the get_prediction tool to predict if the meal will cause increase in glucose for different abstract amounts (heavy, medium, light) of the food.
5. Use the predictions to provide insightful output about eating the meal.
  - Tell the user if it's safe to eat the meal or not based on the different scenarios, and which one will not cause problems.
6. Provide a summary of the conversation and ask if the user has any other questions or needs further assistance.


Do not include the nutrional data or glucose level in the final response. Only provide the recommendation.
DO NOT RETURN THE ANSWER IN MARKDOWN JUST PLAIN TEXT. Keep each section as a separate message to maintain organization.


**Tools available:**
- get_nutri_data: Use this to fetch nutritional data from ingredients of a meal after calling USDA FoodData Central API.
- get_predictions: Use this to predict if the meal will cause increase in glucose in different abstract quantities (heavy, medium, light). Call after the get_nutri_data tool and don't ask for glucose data.
"""
@tool
def get_nutri_data(ingredients: list[str] = None) -> dict[str:float]:

    """Returns list of nutritional data from ingredients and their quantities (optional) of a meal after calling USDA FoodData Central API. Non-given arguments indicate no API calling.
    If the ingredient has quantity, then multiply the calories by a factor with the quantity.
  Args:
    ingredients (list[str], optional): List of ingredients that the meal contains with their quantities. Optional, if not given don't ask.

  Returns:
    dict[str:float]: Nutritional data of the meal.
  """
    #ingredients = ["grilled chicken", "quinoa", "spinach"]
    total_nutrition = {"calories": 0, "protein": 0, "carbohydrates": 0}

    if ingredients is None:
        return total_nutrition

    for ingredient in ingredients:
        match = re.match(r"(\d+)(g|kg|oz|lb)?\s+(.+)", ingredient)
        if match:
            quantity, unit, name = match.groups()
            quantity = float(quantity)  # Convert "250" to 250.0
        else:
            # If no quantity is given, assume 100g
            quantity = 100
            name = ingredient

        # Convert weight if necessary
        conversion_factors = {
            "kg": 1000,  # 1 kg = 1000g
            "oz": 28.35,  # 1 oz = 28.35g
            "lb": 453.59,  # 1 lb = 453.59g
        }
        if unit in conversion_factors:
            quantity *= conversion_factors[unit]  # Convert to grams

        url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={ingredient}&api_key={USDA_API_KEY}&"
        response = requests.get(url)
        data = response.json()
        if data['foods']:
            food_data = data['foods'][0]
            # Aggregate nutritional information
            for nutrient in food_data['foodNutrients']:
                if nutrient['nutrientName'] == "Energy":
                    total_nutrition['calories'] += nutrient['value'] * (quantity/100) if quantity else nutrient['value']
                elif nutrient['nutrientName'] == "Protein":
                    total_nutrition['protein'] += nutrient['value'] * (quantity/100) if quantity else nutrient['value']
                elif nutrient['nutrientName'] == "Carbohydrate, by difference":
                    total_nutrition['carbohydrates'] += nutrient['value'] * (quantity/100) if quantity else nutrient['value']


    return total_nutrition

import matplotlib.pyplot as plt
import base64
from io import BytesIO
import time

def generate_graph_data():
    """
    Generate a graph showing the actual and predicted glucose values.
    Args:
        tool_input (Optional[str]): Input argument required by the tool decorator, not used in the function.
    Returns:
        str: Base64 encoded image of the graph.
    """

    start_time = time.time()

    current = get_sample_current()
    heavy = get_sample_prediction_heavy()
    medium = get_sample_prediction_medium()
    light = get_sample_prediction_light()

    # Load glucose data
    # df = glucose_df[glucose_df['type'] == "cgm"]

    # Extract actual and predicted glucose values

    # actual_y = [{"date": e.date, "glucose": e.glucose} for e in current.iloc[435:454]]
    # heavy_data = [{"date": e.date, "glucose": e.glucose} for e in heavy.iloc[454:473]]
    # medium_data = [{"date": e.date, "glucose": e.glucose} for e in medium.iloc[454:473]]
    # light_data = [{"date": e.date, "glucose": e.glucose} for e in light.iloc[454:473]]

    actual_x = range(453)  # First 453 data points
    actual_y = [i.glucose for i in current]
    print(f"Length of actualx: {len(actual_x)}")
    print(f"Length of actualy: {len(actual_y)}")

    heavy_x = range(453, 550)  # Next range for heavy prediction
    print(f"Length of heavyx: {len(heavy_x)}")
    heavy_y = [i.glucose for i in heavy]
    print(len(heavy_y))

    medium_y = [i.glucose for i in medium]
    print(f"Length of mediumy: {len(medium_y)}")
    light_y = [i.glucose for i in light]
    print(f"Length of lighty: {len(light_y)}")

    print("Time taken (data processing):", time.time() - start_time)

    # Create figure
    fig, ax = plt.subplots(figsize=(8, 6))

    # Plot actual data
    ax.plot(actual_x, actual_y, color='black', linewidth=2, label='Actual Data')

    # Add vertical line at index 453
    ax.axvline(x=453, color='gray', linestyle='--', linewidth=2, label='Separation Line')

    # Plot predicted glucose values
    ax.plot(heavy_x, heavy_y, color='red', linestyle='--', linewidth=2, label='Heavy Prediction')
    ax.plot(heavy_x, medium_y, color='orange', linestyle='--', linewidth=2, label='Medium Prediction')
    ax.plot(heavy_x, light_y, color='green', linestyle='--', linewidth=2, label='Light Prediction')

    print("Time taken (plotting):", time.time() - start_time)

    # Customize the plot
    ax.set_title('Glucose Prediction', fontsize=14, color='black')
    ax.set_xlabel('Time Steps', fontsize=12, color='black')
    ax.set_ylabel('Glucose Level', fontsize=12, color='black')
    ax.legend()
    ax.grid(True, linestyle='--', alpha=0.6)

    # Save image to a buffer
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='jpeg', bbox_inches='tight', dpi=100)
    plt.close(fig)  # Free memory
    img_buffer.seek(0)

    # Convert to base64 for API response
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')

    print("Time taken (image encoding):", time.time() - start_time)

    return img_base64


import random

@tool
def get_predictions(nutri_data: Dict[str, float]) -> Dict[str, List[GlucoseReading]]:
    """
    Returns a ML prediction based on the nutritional data and timeseries glucose data from the user for different amounts of a meal. Non-given arguments indicate no prediction.
    
    Args:
        nutri_data (Dict[str, int]): Nutritional info (calories, carbs, protein, etc.) of the meal.

    Returns:
        Dict[str, List[GlucoseReading]]: ML prediction for different amounts of the meal.
    """
    if not nutri_data:
        return {}

    # Predict glucose level increase for heavy meal
    heavy = get_sample_prediction_heavy()
    # Predict glucose level increase for medium meal
    medium = get_sample_prediction_medium()
    # Predict glucose level increase for light meal
    light = get_sample_prediction_light()

    print(heavy)
    print(medium)



    # # Example of how nutritional info could affect glucose level
    # calories = nutri_data.get("calories", 0)
    # carbs = nutri_data.get("carbohydrates", 0)

    # # Mock a glucose level increase prediction based on calories and carbs
    # predicted_increase = (calories * 0.01) + (carbs * 0.02)

    # # Mock confidence score (randomized)
    # confidence = round(random.uniform(0.7, 0.95), 2)

    # # Simulate the new glucose level prediction
    # predicted_glucose = glucose_level + predicted_increase

    return {"heavy": heavy, "medium": medium, "light": light}

# Initialize LangChain agent
# Pydantic model for request
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str
    image: Optional[str] = None

class GluDailyAgent:
    def __init__(self):

        self.setup_environment()

        self.tools = [get_nutri_data, get_predictions]#mytools

        self.memory = MemorySaver()

        self.prompt = prompt
        
        self.model = ChatOpenAI(model="gpt-4o-mini")

        self.conversations: Dict[str, List[ChatMessage]] = {}

        # Initialize agent
        self.agent = create_react_agent(
            self.model,
            self.tools,
            checkpointer=self.memory,
            prompt=self.prompt
        )

    async def process_message(self, message: str, thread_id: Optional[str] = None):
        """Process a query through the agent and handle all tool calls properly"""
        if not thread_id:
            thread_id = datetime.now().strftime("%Y%m%d-%H%M%S")
            
        config = {"configurable": {"thread_id": thread_id}}
        contains_prediction = False
        
        # Process through agent
        async for chunk in self.agent.astream(
            {"messages": [HumanMessage(content=message)]},
            config
        ):
            if isinstance(chunk, dict):
                if 'agent' in chunk:
                    messages = chunk['agent'].get('messages', [])
                    if messages and isinstance(messages[0], AIMessage):
                        # Check for tool calls in the message
                        tool_calls = messages[0].additional_kwargs.get('tool_calls', [])
                        for tool_call in tool_calls:
                            if tool_call['function']['name'] == 'get_predictions':
                                contains_prediction = True
                        # Get the final response content
                        final_response = messages[0].content
                elif 'tools' in chunk:
                    # Process tool execution results if needed
                    continue

        # Generate graph only if predictions were made
        image_data = None
        if contains_prediction:
            image_data = generate_graph_data()
        
        return final_response, thread_id, image_data

    def setup_environment(self):
        """Setup required environment variables"""
        required_vars = {
            "LANGSMITH_API_KEY": os.getenv("LANGSMITH_API_KEY"),
            "LANGSMITH_TRACING": "true",
            "LANGSMITH_ENDPOINT": "https://api.smith.langchain.com",
        }
        
        for var, value in required_vars.items():
            if value:
                os.environ[var] = value
            else:
                raise ValueError(f"Missing required environment variable: {var}")

# Mock responses
MOCK_RESPONSES = [
    "That sounds delicious! Have you checked your glucose levels?",
    "Interesting choice! Let me check how that affects your blood sugar.",
    "Great! Do you want a low-carb alternative?",
    "Hmm, I’d suggest pairing that with some fiber to slow glucose spikes.",
    "That’s a solid choice! Would you like some recipe ideas?",
]

agent = GluDailyAgent()

@chatbot_router.get("/")
async def chatbot_home():
    return {"message": "Welcome to the Chatbot API!"}


@chatbot_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    try:
        print("diz nuts")
        response, session_id, image = await agent.process_message(request.message, request.session_id)
        print(response)
        print(session_id)

        result = ChatResponse(
            response=response,
            session_id=session_id,
            timestamp=datetime.now().isoformat(),
            image=image
        )
        return result
    except Exception as e:
        return ChatResponse(
            response=f"An error occurred: {str(e)}",
            session_id=request.session_id or "unknown",
            timestamp=datetime.now().isoformat(),
            image=None
        )
    
@chatbot_router.get("/graph")
async def generate_graph():
    img_base64 = generate_graph_data()
    return {"image": img_base64}

