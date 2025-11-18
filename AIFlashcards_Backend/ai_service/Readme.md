# Quiz Question Generator API

This project is a simple Flask-based REST API that generates quiz questions and answers from a given text input.  
It uses a pre-trained **Google FLAN-T5** model from Hugging Face's `transformers` library.

## Features

- Accepts an input text (up to 5000 characters).
- Generates between **1 and 20 quiz questions** along with their answers.
- Ensures each question is unique and contextually relevant to the input text.
- Provides automatic answer generation if missing.

## Installation

1. Clone this repository and navigate into the project directory.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the application:

```bash
python3 app.py
```

The server will start at `http://127.0.0.1:5000`.

## API Usage

### Endpoint

`POST /generate`

### Request JSON

```json
{
  "text": "Your input text here...",
  "num_questions": 5
}
```

- `text`: Input text (required, max 5000 characters).
- `num_questions`: Number of questions to generate (optional, default=1, range 1–20).

### Response JSON

```json
{
  "questions": [
    { "text": "What is X?", "answer": "Y" },
    { "text": "How does A relate to B?", "answer": "C" }
  ]
}
```

### Error Responses

- `400 Bad Request` if:
  - `text` is missing or too long.
  - `num_questions` is outside the allowed range.

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this code.

---
