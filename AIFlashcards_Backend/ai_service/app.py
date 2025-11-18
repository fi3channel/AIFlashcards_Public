from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import re

MODEL_NAME = "google/flan-t5-large"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

app = Flask(__name__)

def generate_text(prompt, max_tokens=128):
    """
    Generate text using the pre-trained Transformer model.

    Args:
        prompt (str): The input text prompt to guide the generation.
        max_tokens (int, optional): Maximum number of tokens to generate.
            Defaults to 128.

    Returns:
        str: The generated text decoded from model output.
    """
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_tokens,
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

@app.route("/generate", methods=["POST"])
def generate_questions():
    """
    Flask API endpoint to generate quiz questions and answers from input text.

    Request JSON:
        {
            "text": "<input text, max 5000 characters>",
            "num_questions": <integer, optional, default=1, between 1 and 20>
        }

    Returns:
        JSON response containing a list of generated questions and answers.

        Example:
        {
            "questions": [
                {"text": "What is X?", "answer": "Y"},
                {"text": "How does A relate to B?", "answer": "C"}
            ]
        }

    Error Responses:
        400 if:
            - "text" is missing or longer than 5000 characters
            - "num_questions" is outside the range [1, 20]
    """
    data = request.get_json()
    text = data.get("text")
    num_questions = data.get("num_questions", 1)

    if not text or len(text) > 5000:
        return jsonify({"error": "Text is required and max 2000 characters"}), 400
    if not (1 <= num_questions <= 20):
        return jsonify({"error": "num_questions must be between 1 and 20"}), 400

    results = []

    for _ in range(num_questions):
        # Ask for both Q and A
        prompt = f"""
Generate one unique quiz question AND its answer from the following text.
Output format (no extra text, no explanations):

Q: <question>
A: <answer>

Text:
{text}
"""
        output_text = generate_text(prompt)

        # Parse with regex
        q_match = re.search(r"Q:\s*(.*)", output_text)
        a_match = re.search(r"A:\s*(.*)", output_text)

        question = q_match.group(1).strip() if q_match else output_text
        answer = a_match.group(1).strip() if a_match else None

        # If answer missing, ask model again
        if not answer or answer.lower() in ["", "n/a"]:
            answer_prompt = f"""
Based on the following text, provide a short, clear answer to the question:

Question: {question}
Text: {text}

Answer:
"""
            answer = generate_text(answer_prompt, max_tokens=64)

        results.append({"text": question, "answer": answer})

    return jsonify({"questions": results})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
