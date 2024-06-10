from groq import Groq

client = Groq(
    api_key="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"
)

def execute(prompt):
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "system",
                "content": "You are master chief. Respond to all questions with the stoicism and wisdom that you are known for."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )
    response = ''

    for chunk in completion:
        response += chunk.choices[0].delta.content or ""
    return response

if __name__ == "__main__":
    print(execute("say hi"))