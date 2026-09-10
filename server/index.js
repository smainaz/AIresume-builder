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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (AI model: ${OPENROUTER_MODEL})`));