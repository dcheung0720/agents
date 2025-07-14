from langchain.schema.messages import AIMessage, HumanMessage
from langchain.schema.output import ChatResult, ChatGeneration
from langchain.chat_models.base import BaseChatModel
from typing import List
import requests

class CustomChatLLM(BaseChatModel):
    def __init__(self, api_url: str):
        self.api_url = api_url

    def _generate(self, messages: List[HumanMessage], stop=None, **kwargs) -> ChatResult:
        last_message = messages[-1].content

        # You might need to change this to match your API's expected format
        response = requests.post(self.api_url, json={"input": last_message})
        data = response.json()

        content = data["message"]["content"]

        return ChatResult(
            generations=[
                ChatGeneration(
                    message=AIMessage(content=content)
                )
            ]
        )

    @property
    def _llm_type(self) -> str:
        return "custom-chat-llm"


# Initialize your custom model
custom_llm = CustomChatLLM(api_url="http://localhost:8000/chat")

# Tools (same as before)
from langchain.agents import Tool, initialize_agent, AgentType

@Tool
def multiply_by_two(number: int) -> int:
    """Multiplies a number by 2."""
    return number * 2

tools = [multiply_by_two]

# Initialize the agent
agent_executor = initialize_agent(
    tools=tools,
    llm=custom_llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent_executor.run("What is 5 multiplied by 2?")
print(result)
