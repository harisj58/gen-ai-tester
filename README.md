<h1 align="center" id="title">Gen AI Tester</h1>

<h2>🚀 Demo</h2>

[https://www.loom.com/share/1badd186770d4a368f6110e6e70765bd](https://www.loom.com/share/1badd186770d4a368f6110e6e70765bd)

<h2>Project Screenshots:</h2>

New chat:
<img src="https://github.com/user-attachments/assets/cd901036-1bf7-4d42-bda8-0d13e5bd9ba5" alt="project-screenshot" />

Introduction and capabilities:
<img src="https://github.com/user-attachments/assets/a7899a1b-34b3-47b9-87b6-9d2883164cdb" alt="project-screenshot" />

Limitations:
<img src="https://github.com/user-attachments/assets/5f4d488a-740c-427e-9b45-a9db1de4cbc3" alt="project-screenshot" />

Generating test cases for Zomato app:
<img src="https://github.com/user-attachments/assets/41b44a2f-c9c1-4146-b812-b22b18ba1f15" alt="project-screenshot" />

Testing with random images:
<img src="https://github.com/user-attachments/assets/51de485a-0d00-4b90-ba5c-cdcb5adf11c9" alt="project-screenshot" />

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Develop test cases
*   Multimodal inputs enabled
*   LLM based chat app
*   Smart app recognition
*   Formatted responses

<h2>Prompting Strategy</h2>

The prompting strategy was pretty straightforward. The LLM was given the proper format with which test cases are generated along with supplementary examples. It was encouraged to only generate test cases when working with screenshots of mobile applications.

<h2>🛠️ Installation and Running:</h2>

<p>1. Install Python 3.10 Node.js and npm</p>

<p>2. Move to server directory</p>

```
cd server/
```

<p>3. Create a python virtual environment</p>

```
python3 -m venv env
```

<p>4. Activate the environment</p>

-  For Linux:
```
source env/bin/activate
```

- For Windows:
```
env\Scripts\activate
```

<p>5. Install required dependencies</p>

```
pip install -r requirements.txt
```

<p>6. Configure server side environment variables</p>

<p>7. Run the server</p>

```
fastapi dev server.py
```

<p>8. Move to client directory</p>

```
cd gen-ai-tester/client/
```

<p>9. Install required dependencies</p>

```
npm i
```

<p>10. Configure client side environment variables</p>

<p>11. Run the client</p>

```
npm run dev
```
  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Python
*   FastAPI
*   Google Gemini
*   Next.js
