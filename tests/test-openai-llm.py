import asyncio
from gpt_researcher.utils.llm import get_llm
from gpt_researcher import GPTResearcher
from dotenv import load_dotenv
load_dotenv()

async def main():

    # Example usage of get_llm function
    llm_provider = "bedrock"
    model = "anthropic.claude-3-haiku-20240307-v1:0"
    region_name="us-east-1"
    max_tokens = 1000

    llm = get_llm(llm_provider, model=model, region_name="us-east-1", max_tokens=max_tokens)
    print(f"LLM Provider: {llm_provider}, Model: {model}, Region Name: {region_name}, Max Tokens: {max_tokens}")
    print('llm: ',llm)
    await test_llm(llm=llm)


async def test_llm(llm):
    # Test the connection with a simple query
    messages = [{"role": "user", "content": "sup?"}]
    try:
        response = await llm.get_chat_response(messages, stream=False)
        print("LLM response:", response)
    except Exception as e:
        print(f"Error: {e}")

# Run the async function
asyncio.run(main())