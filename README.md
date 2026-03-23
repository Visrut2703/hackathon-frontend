# Lisa Interviewer — Frontend

A modern React-based frontend for the Lisa AI Interview platform. Upload your resume, let AI generate tailored interview questions, and receive instant feedback on your answers.

## Features

- 🔒 **Authentication** — Sign up / Sign in with JWT-based auth
- 📄 **Resume Upload** — Drag & drop PDF upload with text extraction
- 🤖 **AI-Powered Interview** — Gemini-generated questions based on your skills
- 📊 **Instant Scoring** — AI evaluates your answers (0–10 per question)
- 👩‍💼 **Admin Dashboard** — View reports, schedule interviews, and analytics

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Deployment:** Vercel (Static Site)

## Setup

```bash
# Install dependencies
npm install

# Create .env file
echo 'VITE_API_BASE_URL=http://localhost:1111' > .env
echo 'VITE_PYTHON_API_BASE_URL=http://localhost:5000' >> .env

# Run locally
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Node.js backend URL |
| `VITE_PYTHON_API_BASE_URL` | Python backend URL |

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` → Your deployed Node.js backend URL
   - `VITE_PYTHON_API_BASE_URL` → Your deployed Python backend URL
4. Deploy — Vercel auto-detects Vite and builds the static site

## Project Architecture

```
Lisa Interviewer/
├── hackathon-frontend/     ← This repo (React + Vite)
├── Lisa-node-backend/      ← Express API + Gemini AI
└── Lisa-Python-backend/    ← Flask PDF extraction
```
