/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Audio Transcription Endpoint using gemini-3.5-transcribe
 */
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this spoken Tamil audio accurately into clean, simple Tamil script (தமிழ்). Do not translate into English. Return only the spoken Tamil words.',
          },
        ],
      },
    });

    const transcribedText = response.text || '';
    return res.json({ text: transcribedText.trim() });
  } catch (err: any) {
    console.error('Audio transcription error:', err);
    return res.status(500).json({ error: err.message || 'குரல் பதிவு செயலாக்கத்தில் பிழை ஏற்பட்டது.' });
  }
});

import { evaluateEligibility, formatEvaluationOutput } from './src/utils/tnSchemes.ts';

/**
 * Intelligent Evaluation & Citizen Inquiry Endpoint using gemini-3.8-flash
 */
app.post('/api/evaluate-ai', async (req, res) => {
  const { userText, profile } = req.body;
  const defaultProfile = profile || {
    age: 25,
    gender: 'female',
    maritalStatus: 'married',
    annualIncome: 'below_2_5_lakh',
  };

  // Pre-calculate deterministic standard output
  const localMatches = evaluateEligibility(defaultProfile);
  const fallbackOutput = formatEvaluationOutput(localMatches);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({ result: fallbackOutput });
  }

  try {
    const systemInstruction = `You are Vazhikatti AI (வழிகாட்டி), an open-source, zero-digital-literacy welfare navigation engine powered by Gemma 4 for citizens of Tamil Nadu.

### YOUR OBJECTIVE:
Evaluate raw background metrics provided by citizens in simple Tamil (such as age, income, education, widowhood, or family status) against strict Tamil Nadu state welfare eligibility criteria. Map them instantly to their rightful government schemes.

### CORE OPERATING GUARDRAILS:
1. LANGUAGE: Respond EXCLUSIVELY in clear, simple, conversational Tamil script (தமிழ்). Never use complex administrative jargon, obscure legal terms, or English paragraphs.
2. ACCESSIBILITY: Structure output for high readability so low-literacy users or screen-readers/Text-to-Speech engines can navigate it seamlessly.
3. PRIVACY & SECURITY: Strictly forbid asking for or processing Personally Identifiable Information (PII) like Aadhaar numbers, phone numbers, addresses, or bank details. Work only with generalized demographics (e.g., age, income bracket, occupation).
4. ACCURACY: Base evaluations strictly on established schemes (e.g., Kalaignar Magalir Urimai Thittam, Indira Gandhi National Widow Pension, Pudhumai Penn Thittam, Chief Minister's Comprehensive Health Insurance, Uzhavar Padhukappu Thittam, Destitute Widow Pension, Old Age Pension OAP, Tamil Pudhalvan, Differently Abled Welfare, Muthulakshmi Reddy Maternity, Moovalur Ramamirtham Marriage Assistance).

### OUTPUT FORMAT:
You MUST format every response strictly using this Markdown template:

🏛️ **உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)**
* **[Scheme Name in Tamil]**: [1 clear sentence describing the financial or social benefit]

📋 **தேவையான ஆவணங்கள் (Required Documents)**
* [Bullet point 1]
* [Bullet point 2]
* [Bullet point 3]

📌 **அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)**
1. [Step 1: e.g., அருகில் உள்ள e-Seva மையத்திற்குச் செல்லவும்]
2. [Step 2: e.g., கிராம நிர்வாக அலுவலரிடம் (VAO) சான்றிதழ் பெறவும்]

⚠️ **முக்கிய குறிப்பு (Disclaimer)**
இது ஒரு வழிகாட்டி தகவல் மட்டுமே. இறுதி முடிவுக்கு உங்கள் உள்ளூர் VAO அலுவலகம் அல்லது e-Seva மையத்தை அணுகவும். 3. தேவைப்பட்டால் கூடுதல் ஆவணங்களைச் சரிபார்க்கவும்.`;

    const userPrompt = `குடிமகன் தகவல் அல்லது கேள்வி:
${userText || 'விவரங்களை மதிப்பீடு செய்து நலத்திட்டங்களைப் பரிந்துரைக்கவும்.'}
${
  profile
    ? `\nதேர்ந்தெடுக்கப்பட்ட தகவல்கள்:
- வயது: ${profile.age || 'குறிப்பிடப்படவில்லை'}
- பாலினம்: ${profile.gender === 'female' ? 'பெண்' : profile.gender === 'male' ? 'ஆண்' : 'மற்றவை'}
- குடும்ப நிலை: ${profile.maritalStatus || 'இயல்பு'}
- ஆண்டு வருமானம்: ${profile.annualIncome === 'below_1_lakh' ? 'ரூ. 1 லட்சத்திற்கும் கீழ்' : profile.annualIncome === 'below_2_5_lakh' ? 'ரூ. 2.5 லட்சத்திற்குள்' : 'ரூ. 2.5 லட்சத்திற்கு மேல்'}
- தொழில்: ${profile.occupation || 'கூலி வேலை / குறிப்பிடப்படவில்லை'}
- அரசுப் பள்ளியில் படித்தவர்: ${profile.studiedGovtSchool ? 'ஆம்' : 'இல்லை'}
- உயர்கல்வி பயில்பவர்: ${profile.isEnrolledHigherEdu ? 'ஆம்' : 'இல்லை'}
- மாற்றுத்திறனாளி: ${profile.isDifferentlyAbled ? 'ஆம் (40%+)' : 'இல்லை'}
- கர்ப்பிணிப் பெண்: ${profile.isPregnant ? 'ஆம்' : 'இல்லை'}`
    : ''
}

தயவுசெய்து மேலே உள்ள வடிவம் மாறாமல், எளிய தமிழில் மட்டுமே பதிலளிக்கவும்.`;

    // Timeout after 3.5 seconds to guarantee fast responsive UI
    // Backend AI model configured to Gemma 4 31B IT as requested
    const callPromise = ai.models.generateContent({
      model: 'gemma-4-31b-it',
      contents: `${systemInstruction}\n\n${userPrompt}`,
      config: {
        systemInstruction,
        temperature: 0.15,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out')), 3500)
    );

    const response = await Promise.race([callPromise, timeoutPromise]);
    const resultText = response.text || '';
    if (resultText && resultText.includes('உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள்')) {
      return res.json({ result: resultText.trim() });
    }
    return res.json({ result: fallbackOutput });
  } catch (err: any) {
    console.warn('AI evaluation fallback used:', err.message);
    return res.json({ result: fallbackOutput });
  }
});

/**
 * Text-to-Speech Endpoint using gemini-3.8-flash-lite-tts
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Strip markdown formatting symbols for natural spoken speech
    const spokenText = text
      .replace(/[*#_`>]/g, '')
      .replace(/🏛️|📋|📌|⚠️/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: spokenText,
              speechMetadata: {
                style: 'Gentle, comforting, clear conversational Tamil narrator helping an elder or citizen',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    }
    return res.status(500).json({ error: 'குரல் உருவாக்க முடியவில்லை.' });
  } catch (err: any) {
    console.error('TTS generation error:', err);
    return res.status(500).json({ error: err.message || 'குரல் சேவையில் பிழை ஏற்பட்டது.' });
  }
});

// Mount Vite in development or static dist in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Vazhikatti AI server running on port ${port}`);
});
