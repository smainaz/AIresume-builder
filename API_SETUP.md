# OpenAI API Setup

## To fix the "AI Enhancement" feature:

### 1. Get your OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Sign up/login and create a new API key
- Copy the key (starts with `sk-...`)

### 2. Add the API Key to your project
- Create a file named `.env` in the `server` folder
- Add this line to the file:
```
OPENAI_API_KEY=sk-your_actual_api_key_here
```

### 3. Restart the server
- Stop the server (Ctrl+C)
- Start it again: `npm start`

### 4. Test the AI Enhancement
- Fill in your resume details
- Click "Enhance with AI"
- It should now work!

---

## PDF Download Fix
The PDF download has been fixed to include all your form data. Just fill in the form and click "Download as PDF".

---

**Note:** The API key is only needed for AI enhancement. The basic resume builder and PDF download work without it. 