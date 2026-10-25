/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { VoiceMicInput } from './components/VoiceMicInput.tsx';
import { VisualDemographicPicker } from './components/VisualDemographicPicker.tsx';
import { SchemeResultsView } from './components/SchemeResultsView.tsx';
import { HelplineDirectory } from './components/HelplineDirectory.tsx';
import {
  CitizenProfile,
  Scheme,
  evaluateEligibility,
  formatEvaluationOutput,
} from './utils/tnSchemes.ts';
import {
  Mic,
  MousePointerClick,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<CitizenProfile>({
    age: 25,
    gender: 'female',
    maritalStatus: 'married',
    annualIncome: 'below_2_5_lakh',
    occupation: 'other',
    studiedGovtSchool: false,
    isDifferentlyAbled: false,
    isEnrolledHigherEdu: false,
    isPregnant: false,
    hasDaughterMarriageSoon: false,
  });

  const [inputMode, setInputMode] = useState<'voice' | 'cards'>('voice');
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [markdownOutput, setMarkdownOutput] = useState<string>('');
  const [isHelplineOpen, setIsHelplineOpen] = useState<boolean>(false);

  // Evaluate profile and/or spoken text
  const handleEvaluate = async (customSpokenText?: string) => {
    const textQuery = customSpokenText !== undefined ? customSpokenText : userSpokenText;

    // 1. Immediately run local deterministic scheme evaluation engine
    const localMatches = evaluateEligibility(profile);
    setMatchedSchemes(localMatches);
    const standardOutput = formatEvaluationOutput(localMatches);
    setMarkdownOutput(standardOutput);
    setHasEvaluated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Asynchronously query Gemma 4 31B IT intelligence for conversational enhancement
    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: textQuery,
          profile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.includes('உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள்')) {
          setMarkdownOutput(data.result);
        }
      }
    } catch (err) {
      console.warn('AI evaluation service unavailable, standard output used:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback when voice transcription completes
  const handleTranscriptionComplete = (tamilText: string) => {
    setUserSpokenText(tamilText);

    // Contextually adjust profile metrics based on transcribed keywords
    const updated = { ...profile };
    if (tamilText.includes('விதவை') || tamilText.includes('கணவர் இல்லை')) {
      updated.maritalStatus = 'destitute_widow';
      updated.gender = 'female';
    }
    if (tamilText.includes('60') || tamilText.includes('62') || tamilText.includes('65') || tamilText.includes('முதியோர்') || tamilText.includes('வயது')) {
      const match = tamilText.match(/(\d{2})/);
      if (match) {
        updated.age = parseInt(match[1], 10);
      } else {
        updated.age = 62;
      }
    }
    if (tamilText.includes('மாணவி') || tamilText.includes('மாணவர்') || tamilText.includes('கல்லூரி')) {
      updated.occupation = 'student_higher_edu';
      updated.isEnrolledHigherEdu = true;
      updated.studiedGovtSchool = true;
      if (tamilText.includes('மாணவி')) updated.gender = 'female';
      if (tamilText.includes('மாணவர்')) updated.gender = 'male';
    }
    if (tamilText.includes('விவசாய') || tamilText.includes('கூலி')) {
      updated.occupation = 'farmer';
    }
    if (tamilText.includes('மாற்றுத்திறனாளி')) {
      updated.isDifferentlyAbled = true;
    }
    if (tamilText.includes('கர்ப்பிணி')) {
      updated.isPregnant = true;
      updated.gender = 'female';
    }

    setProfile(updated);
    handleEvaluate(tamilText);
  };

  const handleReset = () => {
    setHasEvaluated(false);
    setUserSpokenText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1b18] flex flex-col font-['Atkinson_Hyperlegible',_'Noto_Sans_Tamil',_sans-serif]">
      {/* Header */}
      <Header onOpenHelpline={() => setIsHelplineOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10">
        {hasEvaluated ? (
          <SchemeResultsView
            markdownOutput={markdownOutput}
            matchedSchemes={matchedSchemes}
            onReset={handleReset}
            onOpenHelpline={() => setIsHelplineOpen(true)}
          />
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Friendly Hero Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fbf2ed] text-[#d95d39] font-bold text-sm border-2 border-[#dfc0b7]">
                <Sparkles className="w-4 h-4" />
                <span>பூஜ்ஜிய-டிஜிட்டல் அறிவு நலத்திட்ட வழிகாட்டி</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1f1b18] tracking-tight leading-tight">
                உங்களுக்கான தமிழ்நாடு அரசு நலத்திட்டங்களை உடனே அறியுங்கள்
              </h1>
              <p className="text-base sm:text-xl text-[#58423c] font-medium leading-relaxed">
                மகளிர் உரிமைத்தொகை, முதியோர் ஓய்வூதியம், புதுமைப் பெண், மற்றும் இலவச மருத்துவ காப்பீடு உள்ளிட்ட திட்டங்களின் தகுதியை எளிய தமிழில் சரிபார்க்கவும்.
              </p>
            </div>

            {/* Input Mode Selector: Giant Pill Toggle */}
            <div className="flex justify-center">
              <div className="bg-[#f0e6e1] p-1.5 rounded-full inline-flex border-2 border-[#dfc0b7] max-w-md w-full">
                <button
                  type="button"
                  onClick={() => setInputMode('voice')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-extrabold text-sm sm:text-base transition-all ${
                    inputMode === 'voice'
                      ? 'bg-[#d95d39] text-white shadow-md'
                      : 'text-[#58423c] hover:text-[#1f1b18]'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>குரல் மூலம் பேச (Speak)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('cards')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-extrabold text-sm sm:text-base transition-all ${
                    inputMode === 'cards'
                      ? 'bg-[#2b8282] text-white shadow-md'
                      : 'text-[#58423c] hover:text-[#1f1b18]'
                  }`}
                >
                  <MousePointerClick className="w-5 h-5" />
                  <span>படக் கட்டங்கள் (Touch Cards)</span>
                </button>
              </div>
            </div>

            {/* Render Voice Mode or Visual Cards Mode */}
            {inputMode === 'voice' ? (
              <div>
                <VoiceMicInput
                  onTranscriptionComplete={handleTranscriptionComplete}
                  isLoading={isLoading}
                />

                {/* Optional manual text well if user wants to type or edit */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#eae1dc] shadow-sm">
                  <label className="block text-base sm:text-lg font-bold text-[#1f1b18] mb-2">
                    அல்லது உங்கள் நிலைமையை இங்கு சுருக்கமாக எழுதலாம்:
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={userSpokenText}
                      onChange={(e) => setUserSpokenText(e.target.value)}
                      placeholder="உதாரணம்: எனக்கு 60 வயது, விதவை, வறுமைக் கோட்டிற்கு கீழ் உள்ளேன்..."
                      className="w-full p-4 rounded-2xl bg-[#fff8f5] border-2 border-[#dfc0b7] focus:border-[#2b8282] focus:outline-none text-base text-[#1f1b18] font-medium"
                    />
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-[#58423c] font-semibold">
                      🔒 எவ்வித தனிப்பட்ட எண்களும் தேவையில்லை
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEvaluate()}
                      disabled={isLoading}
                      className="tactile-button w-full sm:w-auto px-8 py-4 rounded-full bg-[#d95d39] hover:bg-[#a43716] text-white font-extrabold text-lg shadow-md flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5 stroke-[3]" />
                      <span>திட்டங்களை அறிய (கண்டுபிடி)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <VisualDemographicPicker
                profile={profile}
                onChange={setProfile}
                onSubmit={() => handleEvaluate()}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t-2 border-[#eae1dc] py-6 px-4 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-extrabold text-[#1f1b18] text-sm">
              வழிகாட்டி AI (Vazhikatti AI) - தமிழ்நாடு மக்கள் நலத்திட்ட வழிகாட்டி
            </p>
            <p className="text-xs text-[#58423c]">
              தமிழ்நாடு அரசு நலத்திட்ட வழிகாட்டுதலுக்கான இலவச பொதுச் சேவை.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#58423c]">
            <button
              onClick={() => setIsHelplineOpen(true)}
              className="hover:text-[#a43716] underline"
            >
              உதவி எண்கள் (Helplines)
            </button>
            <span>•</span>
            <span className="text-[#2b8282]">100% தனியுரிமை பாதுகாப்பு</span>
          </div>
        </div>
      </footer>

      {/* Helpline Modal */}
      <HelplineDirectory
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
      />
    </div>
  );
}
