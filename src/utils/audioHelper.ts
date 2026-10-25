/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Audio helper for Tamil speech synthesis and audio playback.
 * First tries backend high-quality Gemini TTS, with seamless fallback to browser Web Speech API.
 */
let currentAudio: HTMLAudioElement | null = null;

export async function speakTamilText(text: string, onStateChange?: (speaking: boolean) => void): Promise<void> {
  stopSpeaking();
  onStateChange?.(true);

  // Clean text from markdown formatting
  const cleanText = text
    .replace(/[*#_`>]/g, '')
    .replace(/🏛️|📋|📌|⚠️/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Try backend Gemini TTS first
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audio) {
        const audioUrl = `data:audio/wav;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        currentAudio = audio;

        audio.onended = () => {
          onStateChange?.(false);
          currentAudio = null;
        };
        audio.onerror = () => {
          fallbackBrowserSpeech(cleanText, onStateChange);
        };

        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('Backend TTS failed, falling back to browser speech synthesis:', err);
  }

  // Fallback to browser SpeechSynthesis
  fallbackBrowserSpeech(cleanText, onStateChange);
}

function fallbackBrowserSpeech(text: string, onStateChange?: (speaking: boolean) => void) {
  if (!('speechSynthesis' in window)) {
    onStateChange?.(false);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ta-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Search for an Indian or Tamil voice if available
  const voices = window.speechSynthesis.getVoices();
  const tamilVoice = voices.find((v) => v.lang.includes('ta') || v.name.includes('Tamil') || v.lang.includes('IN'));
  if (tamilVoice) {
    utterance.voice = tamilVoice;
  }

  utterance.onend = () => {
    onStateChange?.(false);
  };
  utterance.onerror = () => {
    onStateChange?.(false);
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
