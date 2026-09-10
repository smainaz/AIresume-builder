# AI Resume Builder

A full-stack web application that helps you build professional resumes using AI.

## Features
- Modern, responsive UI
- AI-powered resume content generation (OpenAI API)
- Live resume preview
- Download as PDF

## Project Structure
- `client/` — React frontend
- `server/` — Node.js/Express backend

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Setup

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

3. **Set up OpenAI API Key**
   - In `server/.env`, add your OpenAI API key:
     ```env
     OPENAI_API_KEY=sk-...
     ```

4. **Run the app**

   In one terminal, start the backend:
   ```bash
   cd server
   npm start
   ```
   In another terminal, start the frontend:
   ```bash
   cd client
   npm start
   ```

5. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## License
MIT 