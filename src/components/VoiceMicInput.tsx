/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface VoiceMicInputProps {
  onTranscriptionComplete: (tamilText: string) => void;
  isLoading: boolean;
}

export const VoiceMicInput: React.FC<VoiceMicInputProps> = ({
  onTranscriptionComplete,
  isLoading,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const samplePrompts = [
    {
      title: '60+ ஆதரவற்ற முதியவர் / விதவை',
      text: 'எனக்கு 62 வயது ஆகிறது. கணவர் இல்லை. எனக்கு எந்த வருமானமும் இல்லை. எனக்கு என்ன அரசு உதவி கிடைக்கும்?',
    },
    {
      title: 'அரசுப் பள்ளி மாணவி / மாணவர்',
      text: 'நான் 6 முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்து தற்போது கல்லூரியில் முதலாம் ஆண்டு படித்து வருகிறேன்.',
    },
    {
      title: 'விவசாயத் தொழிலாளி',
      text: 'நான் 42 வயது விவசாய கூலித் தொழிலாளி. குடும்பத்தில் 4 பேர் உள்ளோம். ஆண்டு வருமானம் ஒரு லட்சத்திற்குள்.',
    },
    {
      title: 'மாற்றுத்திறனாளி பராமரிப்பு',
      text: 'எங்கள் குடும்பத்தில் 40 சதவீதத்திற்கு மேல் மாற்றுத்திறன் கொண்ட நபர் ஒருவர் உள்ளார். பராமரிப்பு உதவி தேவை.',
    },
  ];

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length === 0) {
          setErrorMessage('குரல் பதிவு கிடைக்கவில்லை. மீண்டும் பேசவும்.');
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleSendAudioToTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(
        'மைக்ரோஃபோன் அணுகல் கிடைக்கவில்லை. உங்கள் பிரவுசரில் மைக் அனுமதியை சரிபார்க்கவும், அல்லது கீழே உள்ள மாதிரிகளைத் தேர்வு செய்யவும்.'
      );
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendAudioToTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Data,
              mimeType: blob.type || 'audio/webm',
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'குரல் பதிவை மாற்ற முடியவில்லை.');
          }

          const data = await res.json();
          if (data.text) {
            onTranscriptionComplete(data.text);
          } else {
            setErrorMessage('குரல் பதிவில் வார்த்தைகள் தெளிவாகக் கேட்கவில்லை. மீண்டும் பேசவும்.');
          }
        } catch (err: any) {
          console.error('Transcribe API error:', err);
          setErrorMessage(err.message || 'குரல் எழுத்தாக்கத்தில் பிழை ஏற்பட்டது.');
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err: any) {
      console.error('Blob read error:', err);
      setErrorMessage('ஆடியோ செயலாக்கத்தில் பிழை.');
      setIsTranscribing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dfc0b7] shadow-sm mb-8">
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf2ed] text-[#a43716] font-bold text-xs sm:text-sm mb-3 border border-[#dfc0b7]">
          <Sparkles className="w-4 h-4" />
          <span>குரல் மூலம் பேசுங்கள் (Speak in Tamil)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b18] mb-2">
          உங்கள் நிலைமையை தமிழில் பேசுங்கள்
        </h2>
        <p className="text-base sm:text-lg text-[#58423c]">
          எழுத்து படிக்கத் தெரியாவிட்டாலும் பரவாயில்லை! மைக்கை அழுத்தி உங்கள் வயது, குடும்ப நிலை மற்றும் தேவையை தமிழில் பேசவும்.
        </p>
      </div>

      {/* Big Tactile Pulsing Record Button */}
      <div className="flex flex-col items-center justify-center py-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            aria-label="பதிவை நிறுத்த அழுத்துங்கள்"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#ba1a1a] text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 breathing-glow border-4 border-white"
          >
            <Square className="w-10 h-10 mb-1" />
            <span className="text-sm font-black tracking-wider">நிறுத்து ({recordingSeconds}s)</span>
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={isTranscribing || isLoading}
            aria-label="தமிழில் பேச மைக்ரோஃபோனை அழுத்துங்கள்"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#d95d39] text-white flex flex-col items-center justify-center shadow-xl transition-all hover:bg-[#a43716] active:translate-y-1 breathing-glow border-4 border-white disabled:opacity-50"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin mb-1" />
                <span className="text-xs font-bold">புரிந்துகொள்கிறது...</span>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12 mb-1" />
                <span className="text-sm font-black">பேச தொடங்கு</span>
              </>
            )}
          </button>
        )}

        <p className="mt-4 text-sm font-semibold text-[#58423c]">
          {isRecording
            ? '🔴 மைக் இயங்குகிறது... பேசி முடித்ததும் மேலே உள்ள சிவப்பு பொத்தானை அழுத்தவும்'
            : isTranscribing
            ? '✨ Gemma 4 குரல் கேட்கிறது... தயவுசெய்து ஒரு நொடி காத்திருக்கவும்'
            : '👆 மைக்கை ஒருமுறை தொட்டு பேசத் தொடங்கவும்'}
        </p>
      </div>

      {/* Error message if any */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-[#ffdad6] text-[#93000a] text-sm font-semibold flex items-start gap-3 border border-[#ba1a1a]/30">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Suggested Tamil Voice Scenarios */}
      <div className="mt-8 pt-6 border-t border-[#f0e6e1]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#58423c]">
            அல்லது ஒருமுறை தொட்டு தெரிந்து கொள்ள மாதிரி சூழல்கள்:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onTranscriptionComplete(p.text)}
              className="tactile-button text-left p-3.5 rounded-2xl bg-[#fff8f5] hover:bg-[#fbf2ed] border-2 border-[#dfc0b7] transition-all flex flex-col justify-between"
            >
              <span className="text-sm font-bold text-[#a43716] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> {p.title}
              </span>
              <span className="text-xs text-[#58423c] line-clamp-2">
                "{p.text}"
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
