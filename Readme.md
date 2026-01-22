# AIFlashcards

AIFlashcards is a web application that generates quiz questions and answers from input text using a Python AI service and provides a frontend UI built with Angular.

---

## 📦 Requirements

### Node.js and npm

#### Installation Steps(Ubuntu)
```bash
1) sudo apt update

2) sudo apt upgrade

3) curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

4) nvm -v (must print certain version) 

5) nvm install 20

6) nvm list (there the correct version should be visible)

7) nvm use 20 (if not default)

8) node -v

9) npm -v
```

- Node.js: **v20.x** (LTS recommended)
- npm: **v9.x** or higher

### Python

- Python: **3.10+**
- pip3: latest version

Check your Python version:

```bash
python3 --version
pip3 --version
```

### System Requirements

- Linux, macOS, or Windows with WSL2
- Minimum 8GB RAM recommended for AI model inference

---

## 🛠 Installation

The project includes a convenient setup script to install dependencies and build the frontend.

```bash
./installApp.sh
```

This script will:

1. Install Node.js dependencies for the backend.
2. Set up a Python virtual environment and install Python dependencies for the AI service.
3. Build the Angular frontend.

---

## ⚙️ Running the Application

### Start All Services

Use the provided script to start backend, Python AI service, and frontend together:

```bash
./startApp.sh
```

### Backend (Node.js)

Alternatively, run manually:

```bash
cd AIFlashcards_Backend
npm run dev
```

### Python AI Service

Activate virtual environment and run service:

```bash
cd AIFlashcards_Backend/ai_service
source venv/bin/activate
python app.py
```

The AI service will run on [**http://localhost:5000**](http://localhost:5000).

### Frontend (Angular)

```bash
cd AIFlashcards_Frontend
npm run start
```

The frontend will run on [**http://localhost:4200**](http://localhost:4200).

---

## 📝 Project Structure

```
AIFlashcards/
├── AIFlashcards_Backend/
│   ├── package.json
│   ├── server.js
│   └── ai_service/
│       ├── app.py
│       └── requirements.txt
├── AIFlashcards_Frontend/
│   ├── package.json
│   └── src/
├── installApp.sh
└── runApp.sh
```

---

## ⚡ Notes

- Ensure Python 3.10+ and Node.js v20+ are installed before running the setup script.
- The Python AI service uses **Flask** and **Transformers** (`google/flan-t5-large` model). GPU is recommended but not required.
- The frontend is built using **Angular 20** and **Tailwind CSS**.

---

## 🧑‍💻 License

This project is free to use and modify under the [MIT License](LICENSE).
