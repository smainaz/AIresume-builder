import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

const SYSTEM_PROMPT = `You are an elite executive resume writer and career strategist. You transform rough notes into polished, ATS-optimized resume content that wins interviews.

Your writing style:
- Lead with impact: strong action verbs, quantified results, and business outcomes
- Use implied third person in the summary (never start with "I")
- Format experience as achievement bullets prefixed with "• " (one per line)
- Mirror keywords from the target role when provided
- Expand skills into a focused, market-relevant list (8–15 items max)
- Polish education, certifications, languages, and hobbies concisely

Strict rules:
- Never invent employers, degrees, dates, or credentials not supported by the input
- You may infer reasonable metrics ONLY when the input clearly implies scale (team, revenue, users)
- Return ONLY valid JSON — no markdown fences, no commentary

JSON schema:
{
  "summary": "3-4 sentence professional summary",
  "experience": "bullet list with • prefix, one achievement per line",
  "education": "polished education section",
  "skills": ["skill1", "skill2"],
  "certifications": "polished certifications or empty string",
  "languages": "polished languages or empty string",
  "hobbies": "brief professional interests or empty string",
  "headline": "one-line professional headline under 12 words"
}`;

function buildUserPrompt(data) {
  const skills = Array.isArray(data.skills) ? data.skills.join(', ') : data.skills;
  const target = data.targetRole?.trim();

  return `Enhance this resume content for maximum impact${target ? ` targeting the role: "${target}"` : ''}.

Name: ${data.name || 'Not provided'}
Current summary: ${data.summary || 'None provided'}
Experience (raw): ${data.experience || 'None provided'}
Education: ${data.education || 'None provided'}
Skills: ${skills || 'None provided'}
Certifications: ${data.certifications || 'None provided'}
Languages: ${data.languages || 'None provided'}
Hobbies: ${data.hobbies || 'None provided'}

Rewrite every section. Make it compelling, specific, and recruiter-ready.`;
}

function parseAIJson(raw) {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

function basicFallback(data) {
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const skillText = skills.length ? skills.join(', ') : 'relevant technical and professional skills';

  return {
    summary: `Results-driven professional with proven expertise in ${skillText}. ${data.summary || 'Demonstrated track record of delivering measurable outcomes and collaborating across teams.'} Seeking to leverage experience in ${data.targetRole || 'a challenging role'} to drive continued growth and impact.`,
    experience: data.experience
      ? data.experience.split('\n').filter(Boolean).map(line => line.startsWith('•') ? line : `• ${line}`).join('\n')
      : '• Contributed to key initiatives delivering measurable business results\n• Collaborated cross-functionally to improve processes and outcomes\n• Applied core competencies to solve complex challenges',
    education: data.education || '',
    skills: skills.length ? skills : ['Communication', 'Problem Solving', 'Team Leadership', 'Project Management'],
    certifications: data.certifications || '',
    languages: data.languages || '',
    hobbies: data.hobbies || '',
    headline: data.targetRole ? `Experienced ${data.targetRole}` : `Experienced ${data.name || 'Professional'}`,
  };
}

app.post('/api/ai-resume', async (req, res) => {
  const { name, email, phone, summary, experience, education, skills, hobbies, languages, certifications, targetRole } = req.body;

  if (!OPENROUTER_API_KEY) {
    const enhanced = basicFallback({ name, summary, experience, education, skills, hobbies, languages, certifications, targetRole });
    return res.json({
      name, email, phone,
      ...enhanced,
      note: 'Basic enhancement applied — add OPENROUTER_API_KEY to server/.env for AI Pro enhancement',
    });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(req.body) },
        ],
        max_tokens: 2500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ResumeBuilder',
        },
        timeout: 60000,
      }
    );

    const raw = response.data.choices?.[0]?.message?.content || '';
    const enhanced = parseAIJson(raw);

    res.json({
      name,
      email,
      phone,
      summary: enhanced.summary || summary,
      experience: enhanced.experience || experience,
      education: enhanced.education || education,
      skills: Array.isArray(enhanced.skills) ? enhanced.skills : skills,
      hobbies: enhanced.hobbies ?? hobbies,
      languages: enhanced.languages ?? languages,
      certifications: enhanced.certifications ?? certifications,
      headline: enhanced.headline || '',
      targetRole: targetRole || '',
      model: OPENROUTER_MODEL,
    });
  } catch (err) {
    console.error('OpenRouter AI generation error:', err?.response?.data || err.message);

    const enhanced = basicFallback({ name, summary, experience, education, skills, hobbies, languages, certifications, targetRole });
    res.json({
      name, email, phone,
      ...enhanced,
      targetRole: targetRole || '',
      note: 'Enhanced with fallback formatting (AI service unavailable)',
    });
  }
});

// ---------------------------------------------------------------------------
// Jobs near you
// ---------------------------------------------------------------------------
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const ADZUNA_COUNTRY = process.env.ADZUNA_COUNTRY || 'gb'; // Adzuna's supported country code, e.g. gb, us, za

const MOCK_JOBS = [
  { title: 'IT Support Specialist', company: 'Sample Co.', location: 'Nairobi, Kenya', url: '#', salary: null, posted: null },
  { title: 'ERP / Dynamics 365 Administrator', company: 'Sample Ltd.', location: 'Nairobi, Kenya', url: '#', salary: null, posted: null },
  { title: 'Frontend Developer (React)', company: 'Sample Studio', location: 'Remote', url: '#', salary: null, posted: null },
  { title: 'Network & Systems Administrator', company: 'Sample Group', location: 'Nairobi, Kenya', url: '#', salary: null, posted: null },
  { title: 'Power Platform Developer', company: 'Sample Solutions', location: 'Remote', url: '#', salary: null, posted: null },
  { title: 'Customer Support Associate', company: 'Sample Inc.', location: 'Nairobi, Kenya', url: '#', salary: null, posted: null },
];

app.get('/api/jobs', async (req, res) => {
  const location = (req.query.location || '').trim();
  const keywords = (req.query.keywords || '').trim();

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    const filtered = location
      ? MOCK_JOBS.filter(j => j.location.toLowerCase().includes(location.toLowerCase()))
      : MOCK_JOBS;
    return res.json({
      jobs: (filtered.length ? filtered : MOCK_JOBS).slice(0, 6),
      source: 'sample',
      note: 'Sample jobs shown — add ADZUNA_APP_ID and ADZUNA_APP_KEY to server/.env for live listings.',
    });
  }

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/1`;
    const response = await axios.get(url, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: 6,
        what: keywords || undefined,
        where: location || undefined,
        'content-type': 'application/json',
      },
      timeout: 15000,
    });

    const jobs = (response.data.results || []).map(j => ({
      title: j.title,
      company: j.company?.display_name || 'Unknown',
      location: j.location?.display_name || location || 'N/A',
      url: j.redirect_url,
      salary: j.salary_min && j.salary_max ? `${Math.round(j.salary_min)} - ${Math.round(j.salary_max)}` : null,
      posted: j.created,
    }));

    res.json({ jobs, source: 'adzuna' });
  } catch (err) {
    console.error('Adzuna jobs error:', err?.response?.data || err.message);
    res.json({
      jobs: MOCK_JOBS.slice(0, 6),
      source: 'sample',
      note: 'Live job search is temporarily unavailable — showing sample listings.',
    });
  }
});

// ---------------------------------------------------------------------------
// Chatbot — enquiry assistant
// ---------------------------------------------------------------------------
const CHATBOT_SYSTEM_PROMPT = `You are the friendly support assistant embedded in "ResumeBuilder", an AI-powered resume builder web app.
Help users with: choosing templates, using the AI enhancement feature, downloading their resume as a PDF, creating an account or signing in (including with Google), understanding their dashboard stats, and general resume/job-search tips.
Keep replies short — 2 to 4 sentences, friendly and practical. If you don't know something app-specific, say so honestly and suggest they contact support instead of guessing.`;

function cannedChatbotReply(message) {
  const text = message.toLowerCase();
  if (text.includes('pdf') || text.includes('download')) {
    return 'To download your resume, fill in the builder form and click "Download PDF" on the preview panel — it saves using whichever template you\'ve selected.';
  }
  if (text.includes('template')) {
    return 'You can browse and pick a resume template from the Templates page, then head to the Builder to fill in your details with that template applied.';
  }
  if (text.includes('ai') || text.includes('enhance')) {
    return 'The "Enhance with AI" option in the builder rewrites your summary, experience, and skills to be more recruiter-ready — just fill in your raw details first.';
  }
  if (text.includes('google') || text.includes('sign in') || text.includes('login') || text.includes('log in')) {
    return 'You can sign in or sign up using your Google account with the "Sign in with Google" button on the Login/Signup pages, or use an email and password.';
  }
  if (text.includes('job')) {
    return 'Your Dashboard shows job listings near your area — enter your city there and we\'ll pull in current openings for you.';
  }
  return "I'm here to help with anything about building, enhancing, or downloading your resume, your account, or your dashboard. Could you tell me a bit more about what you need?";
}

app.post('/api/chatbot', async (req, res) => {
  const { message, history } = req.body;
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!OPENROUTER_API_KEY) {
    return res.json({ reply: cannedChatbotReply(message), source: 'fallback' });
  }

  try {
    const messages = [
      { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-6) : []),
      { role: 'user', content: message },
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model: OPENROUTER_MODEL, messages, max_tokens: 300, temperature: 0.6 },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ResumeBuilder',
        },
        timeout: 30000,
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim() || cannedChatbotReply(message);
    res.json({ reply, source: 'ai' });
  } catch (err) {
    console.error('Chatbot error:', err?.response?.data || err.message);
    res.json({ reply: cannedChatbotReply(message), source: 'fallback' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (AI model: ${OPENROUTER_MODEL})`));