/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
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
  MicOff,
  MousePointerClick,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Square,
  Volume2,
  Check,
  ShieldCheck,
  ShieldAlert,
  Radio,
  UserCheck,
} from 'lucide-react';

type MicPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported';

export default function App() {
  const [profile, setProfile] = useState<CitizenProfile>({
    age: 32,
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

  // Web Speech API states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micPermission, setMicPermission] = useState<MicPermissionState>('prompt');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Quick Tamil Voice / Text Sample Scenarios
  const samplePrompts = [
    {
      title: 'விவசாயி / விவசாயக் கூலி (ஆண்/பெண்)',
      text: 'நான் 42 வயது விவசாய கூலித் தொழிலாளி. குடும்பத்தில் 4 பேர் உள்ளோம். ஆண்டு வருமானம் ஒரு லட்சத்திற்குள்.',
      suggestedGender: 'male' as const,
      suggestedOccupation: 'farmer' as const,
      suggestedAge: 42,
    },
    {
      title: 'மாற்றுத்திறனாளி பராமரிப்பு உதவி',
      text: 'எங்கள் குடும்பத்தில் 40 சதவீதத்திற்கு மேல் மாற்றுத்திறன் கொண்ட நபர் ஒருவர் உள்ளார். பராமரிப்பு உதவி தேவை.',
      suggestedDisabled: true,
      suggestedGender: 'male' as const,
    },
    {
      title: 'முதியோர் ஓய்வூதியம் (60+ வயது)',
      text: 'எனக்கு 65 வயது ஆகிறது. எந்த வருமானமும் இல்லை. எனக்கு என்ன அரசு முதியோர் உதவி கிடைக்கும்?',
      suggestedAge: 65,
      suggestedGender: 'male' as const,
    },
    {
      title: 'அரசுப் பள்ளி கல்லூரி மாணவர் (தமிழ்ப் புதல்வன்)',
      text: 'நான் 6 முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்து தற்போது கல்லூரியில் பயிலும் மாணவன்.',
      suggestedGender: 'male' as const,
      suggestedOccupation: 'student_higher_edu' as const,
      suggestedAge: 19,
    },
    {
      title: 'மகளிர் உரிமைத்தொகை / குடும்பத் தலைவி',
      text: 'நான் குடும்பத் தலைவி. வயது 35. ரேஷன் அட்டை உள்ளது. கலைஞர் மகளிர் உரிமைத்தொகை பெற முடியுமா?',
      suggestedGender: 'female' as const,
      suggestedAge: 35,
    },
    {
      title: 'ஆதரவற்ற விதவை ஓய்வூதியம்',
      text: 'எனக்கு 48 வயது ஆகிறது. கணவர் இல்லை. ஆதரவற்ற விதவை. அரசு உதவித்தொகை தேவை.',
      suggestedGender: 'female' as const,
      suggestedAge: 48,
    },
  ];

  // Initialize Microphone Permission Status query
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setMicPermission('unsupported');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          setMicPermission(permissionStatus.state as MicPermissionState);
          permissionStatus.onchange = () => {
            setMicPermission(permissionStatus.state as MicPermissionState);
          };
        })
        .catch(() => {
          // If query throws or not supported, keep default 'prompt'
        });
    }
  }, []);

  // Web Speech API continuous recognition with ta-IN (Tamil - India)
  const startContinuousSpeechRecognition = () => {
    setSpeechError(null);

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setMicPermission('unsupported');
      setSpeechError('உங்கள் இணைய உலாவியில் Web Speech API நேரடி ஆதரவு இல்லை. கீழே உள்ள மாதிரிகளைத் தேர்வு செய்யவும்.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      // Ensure Web Speech API uses ta-IN (Tamil - India) continuous recognition
      recognition.lang = 'ta-IN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let accumulatedFinal = userSpokenText ? userSpokenText.trim() + ' ' : '';

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermission('granted');
        setSpeechError(null);
      };

      // Updates user text input area live as speech is recognized
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let currentBatchFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0]?.transcript || '';
          if (item.isFinal) {
            currentBatchFinal += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (currentBatchFinal) {
          accumulatedFinal += currentBatchFinal;
        }

        const liveText = (accumulatedFinal + interimTranscript).trim();
        // Update state in real-time
        setUserSpokenText(liveText);

        // Intelligently infer profile metrics from live speech
        analyzeTamilSpeech(liveText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setMicPermission('denied');
          setSpeechError('மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டுள்ளது. உலாவியின் அமைப்புகளில் மைக் அனுமதியை இயக்கிவிட்டு மீண்டும் முயற்சிக்கவும்.');
        } else if (event.error === 'no-speech') {
          // Soft error, no sound detected
        } else {
          setSpeechError(`குரல் அறிதலில் சிக்கல்: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('மைக்ரோஃபோனைத் தொடங்குவதில் பிழை ஏற்பட்டது.');
      setIsListening(false);
    }
  };

  const stopContinuousSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  const toggleContinuousSpeech = () => {
    if (isListening) {
      stopContinuousSpeechRecognition();
    } else {
      startContinuousSpeechRecognition();
    }
  };

  // Gender Change handler with full female-scheme filtering when 'male' is selected
  const handleGenderChange = (newGender: 'male' | 'female' | 'transgender') => {
    setProfile((prev) => {
      const updated: CitizenProfile = {
        ...prev,
        gender: newGender,
      };

      if (newGender === 'male') {
        // Filter out female-only states
        updated.isPregnant = false;
        if (updated.maritalStatus === 'destitute_widow' || updated.maritalStatus === 'widow') {
          updated.maritalStatus = 'married';
        }
        // If college student, switch to Tamil Pudhalvan parameters
        if (updated.occupation === 'student_higher_edu') {
          updated.studiedGovtSchool = true;
          updated.isEnrolledHigherEdu = true;
        }
      }

      if (newGender === 'transgender') {
        updated.isPregnant = false;
      }

      return updated;
    });
  };

  // Contextually adjust profile metrics based on spoken words
  const analyzeTamilSpeech = (text: string) => {
    setProfile((prev) => {
      const updated = { ...prev };
      if (text.includes('விதவை') || text.includes('கணவர் இல்லை')) {
        updated.maritalStatus = 'destitute_widow';
        updated.gender = 'female';
      }
      if (text.includes('கர்ப்பிணி')) {
        updated.isPregnant = true;
        updated.gender = 'female';
      }
      if (text.includes('மாணவர்') || text.includes('மாணவன்')) {
        updated.gender = 'male';
        updated.occupation = 'student_higher_edu';
        updated.isEnrolledHigherEdu = true;
        updated.studiedGovtSchool = true;
      }
      if (text.includes('மாணவி')) {
        updated.gender = 'female';
        updated.occupation = 'student_higher_edu';
        updated.isEnrolledHigherEdu = true;
        updated.studiedGovtSchool = true;
      }
      if (text.includes('விவசாய') || text.includes('உழவர்') || text.includes('கூலி')) {
        updated.occupation = 'farmer';
      }
      if (text.includes('மாற்றுத்திறனாளி') || text.includes('ஊனம்')) {
        updated.isDifferentlyAbled = true;
      }
      if (text.includes('திருநங்கை')) {
        updated.gender = 'transgender';
      }

      const ageMatch = text.match(/(\d{2})\s*வயது/);
      if (ageMatch) {
        updated.age = parseInt(ageMatch[1], 10);
      } else if (text.includes('60') || text.includes('65') || text.includes('முதியோர்')) {
        updated.age = 65;
      }

      return updated;
    });
  };

  // Evaluate profile and/or spoken text
  const handleEvaluate = async (customSpokenText?: string, customProfile?: CitizenProfile) => {
    const textQuery = customSpokenText !== undefined ? customSpokenText : userSpokenText;
    const activeProfile = customProfile || profile;

    // Stop listening if running
    if (isListening) {
      stopContinuousSpeechRecognition();
    }

    setIsLoading(true);

    // 1. Immediately evaluate local deterministic eligibility criteria
    const localMatches = evaluateEligibility(activeProfile);
    setMatchedSchemes(localMatches);
    const standardOutput = formatEvaluationOutput(localMatches);
    setMarkdownOutput(standardOutput);
    setHasEvaluated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Query Gemma 4 31B IT backend for conversational enrichment
    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: textQuery,
          profile: activeProfile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.includes('உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள்')) {
          setMarkdownOutput(data.result);
        }
      }
    } catch (err) {
      console.warn('Gemma 4 evaluation query completed with standard output fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySample = (sample: (typeof samplePrompts)[0]) => {
    setUserSpokenText(sample.text);
    const updated: CitizenProfile = {
      ...profile,
      gender: sample.suggestedGender || profile.gender,
      age: sample.suggestedAge || profile.age,
      occupation: sample.suggestedOccupation || profile.occupation,
      isDifferentlyAbled: sample.suggestedDisabled || profile.isDifferentlyAbled,
    };
    if (sample.suggestedGender === 'male') {
      updated.isPregnant = false;
      if (updated.maritalStatus === 'destitute_widow' || updated.maritalStatus === 'widow') {
        updated.maritalStatus = 'married';
      }
      if (sample.suggestedOccupation === 'student_higher_edu') {
        updated.studiedGovtSchool = true;
        updated.isEnrolledHigherEdu = true;
      }
    }
    setProfile(updated);
    handleEvaluate(sample.text, updated);
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {hasEvaluated ? (
          <SchemeResultsView
            markdownOutput={markdownOutput}
            matchedSchemes={matchedSchemes}
            onReset={handleReset}
            onOpenHelpline={() => setIsHelplineOpen(true)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            {/* Friendly Hero Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf2ed] text-[#d95d39] font-bold text-xs sm:text-sm border border-[#dfc0b7]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>பூஜ்ஜிய-டிஜிட்டல் அறிவு நலத்திட்ட வழிகாட்டி</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-[#1f1b18] tracking-tight leading-snug">
                உங்கள் அரசு நலத்திட்டங்களை உடனே அறியுங்கள்
              </h1>
              <p className="text-xs sm:text-sm text-[#58423c] font-medium leading-relaxed max-w-xl mx-auto">
                குரல் வழியாகப் பேசியோ அல்லது எளிய விவரங்களைத் தொட்டோ உங்கள் தகுதியை நொடியில் கண்டறியவும்.
              </p>
            </div>

            {/* Profile Section: Explicit Gender Toggle Switch (ஆண் / பெண் / திருநங்கை) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border sm:border-2 border-[#dfc0b7] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf2ed] text-[#d95d39] font-black flex items-center justify-center text-xs sm:text-sm border border-[#dfc0b7]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[#1f1b18] leading-tight">
                      சுயவிவரம்: பாலினம் தேர்வு (Select Gender)
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#58423c]">
                      பாலினத்திற்கு ஏற்ப அரசு நலத்திட்டங்கள் துல்லியமாக வடிகட்டப்படும்
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 self-start sm:self-auto px-2.5 py-1 rounded-full bg-[#fff8f5] text-[#58423c] border border-[#dfc0b7] text-[11px] font-bold">
                  <span>தற்போதைய தேர்வு:</span>
                  <span className="text-[#a43716]">
                    {profile.gender === 'male'
                      ? '👨 ஆண் (Male)'
                      : profile.gender === 'female'
                      ? '👩 பெண் (Female)'
                      : '⚧️ திருநங்கை (Transgender)'}
                  </span>
                </div>
              </div>

              {/* Explicit Gender Toggle Switch Component */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-[#fbf2ed] rounded-xl sm:rounded-2xl border border-[#dfc0b7]">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  aria-pressed={profile.gender === 'male'}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all tactile-button ${
                    profile.gender === 'male'
                      ? 'bg-[#2b8282] text-white shadow-sm ring-2 ring-[#006a6a]'
                      : 'bg-white text-[#1f1b18] hover:bg-[#fff8f5] border border-[#dfc0b7]'
                  }`}
                >
                  <span className="text-base sm:text-lg">👨</span>
                  <span>ஆண் (Male)</span>
                  {profile.gender === 'male' && (
                    <Check className="w-3.5 h-3.5 hidden sm:inline-block stroke-[3]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  aria-pressed={profile.gender === 'female'}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all tactile-button ${
                    profile.gender === 'female'
                      ? 'bg-[#d95d39] text-white shadow-sm ring-2 ring-[#a43716]'
                      : 'bg-white text-[#1f1b18] hover:bg-[#fff8f5] border border-[#dfc0b7]'
                  }`}
                >
                  <span className="text-base sm:text-lg">👩</span>
                  <span>பெண் (Female)</span>
                  {profile.gender === 'female' && (
                    <Check className="w-3.5 h-3.5 hidden sm:inline-block stroke-[3]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderChange('transgender')}
                  aria-pressed={profile.gender === 'transgender'}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all tactile-button ${
                    profile.gender === 'transgender'
                      ? 'bg-[#6750a4] text-white shadow-sm ring-2 ring-[#4f378b]'
                      : 'bg-white text-[#1f1b18] hover:bg-[#fff8f5] border border-[#dfc0b7]'
                  }`}
                >
                  <span className="text-base sm:text-lg">⚧️</span>
                  <span>திருநங்கை</span>
                  {profile.gender === 'transgender' && (
                    <Check className="w-3.5 h-3.5 hidden sm:inline-block stroke-[3]" />
                  )}
                </button>
              </div>

              {/* Dynamic Note Explaining Male vs Female Scheme Mapping */}
              {profile.gender === 'male' ? (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#e6f4ea] text-[#137333] border border-[#ceead6] text-[11px] sm:text-xs font-semibold flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#137333]" />
                  <div>
                    <span className="font-bold">ஆண்களுக்கான பிரத்யேகத் திட்டங்கள்:</span> முதலமைச்சரின் உழவர் பாதுகாப்புத் திட்டம், முதலமைச்சரின் விரிவான மருத்துவக் காப்பீடு (CMCHIS - ரூ. 5 லட்சம்), மாற்றுத்திறனாளிகள் பராமரிப்பு உதவித்தொகை, தமிழ்ப் புதல்வன் திட்டம், முதியோர் ஓய்வூதியம் (OAP) போன்றவை மதிப்பீடு செய்யப்படும். பெண்களுக்கு மட்டுமேயான திட்டங்கள் தானாக வடிகட்டப்பட்டுள்ளன.
                  </div>
                </div>
              ) : profile.gender === 'transgender' ? (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#f3e8fd] text-[#5b21b6] border border-[#e9d5ff] text-[11px] sm:text-xs font-semibold flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#5b21b6]" />
                  <div>
                    <span className="font-bold">திருநங்கைகளுக்கான திட்டங்கள்:</span> தமிழ்நாடு திருநங்கைகள் மாதாந்திர ஓய்வூதியத் திட்டம் (40+ வயது), கலைஞர் மகளிர் உரிமைத்தொகை மற்றும் முதலமைச்சர் இலவச மருத்துவக் காப்பீடு (CMCHIS) மதிப்பீடு செய்யப்படும்.
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#fef7e0] text-[#7a4100] border border-[#feefc3] text-[11px] sm:text-xs font-semibold flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#7a4100]" />
                  <div>
                    <span className="font-bold">பெண்களுக்கான சிறப்புத் திட்டங்கள்:</span> கலைஞர் மகளிர் உரிமைத் திட்டம் (ரூ. 1,000), புதுமைப் பெண் திட்டம், ஆதரவற்ற விதவை ஓய்வூதியம், டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு உதவி ஆகியவை மதிப்பீடு செய்யப்படும்.
                  </div>
                </div>
              )}
            </div>

            {/* Input Mode Selector: Voice vs Cards */}
            <div className="flex justify-center">
              <div className="bg-[#f0e6e1] p-1 rounded-full inline-flex border border-[#dfc0b7] max-w-sm w-full shadow-2xs">
                <button
                  type="button"
                  onClick={() => setInputMode('voice')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full font-black text-xs sm:text-sm transition-all ${
                    inputMode === 'voice'
                      ? 'bg-[#d95d39] text-white shadow-xs'
                      : 'text-[#58423c] hover:text-[#1f1b18]'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>குரல் வழி (Speak)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('cards')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full font-black text-xs sm:text-sm transition-all ${
                    inputMode === 'cards'
                      ? 'bg-[#2b8282] text-white shadow-xs'
                      : 'text-[#58423c] hover:text-[#1f1b18]'
                  }`}
                >
                  <MousePointerClick className="w-4 h-4" />
                  <span>படக் கட்டங்கள் (Cards)</span>
                </button>
              </div>
            </div>

            {/* Voice Input Section with Web Speech ta-IN Continuous Recognition */}
            {inputMode === 'voice' ? (
              <div className="space-y-3.5">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border sm:border-2 border-[#dfc0b7] shadow-xs text-center">
                  {/* Explicit Browser Microphone Permission Indicator */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    {micPermission === 'granted' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4ea] text-[#137333] border border-[#ceead6] text-xs font-bold shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#137333]" />
                        <span>மைக்ரோஃபோன் அனுமதி: வழங்கப்பட்டுள்ளது (Microphone: Allowed)</span>
                      </div>
                    ) : micPermission === 'denied' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf] text-xs font-bold shadow-2xs">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#c5221f]" />
                        <span>மைக்ரோஃபோன் அனுமதி: மறுக்கப்பட்டுள்ளது (Microphone: Blocked)</span>
                      </div>
                    ) : micPermission === 'unsupported' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0] text-xs font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-[#5f6368]" />
                        <span>நேரடி குரல் பிரவுசரில் இல்லை (Web Speech Not Supported)</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7e0] text-[#7a4100] border border-[#feefc3] text-xs font-bold">
                        <Radio className="w-3.5 h-3.5 text-[#7a4100] animate-pulse" />
                        <span>மைக் அனுமதி: கேட்கப்படும் (Microphone: Ready to Prompt)</span>
                      </div>
                    )}

                    <span className="text-[11px] text-[#58423c] font-medium hidden sm:inline">
                      • மொழி: தமிழ் (ta-IN)
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-black text-[#1f1b18] mb-1">
                    தமிழில் தொடர்ந்து பேசுங்கள்
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58423c] max-w-md mx-auto mb-4">
                    பொத்தானை அழுத்தி பேசத் தொடங்குங்கள். நீங்கள் பேசப்பேச கீழே உள்ள கட்டத்தில் வார்த்தைகள் உடனுக்குடன் பதிவாகும்.
                  </p>

                  {/* Pulsing Mic Button */}
                  <div className="flex flex-col items-center justify-center py-1 sm:py-2">
                    {isListening ? (
                      <button
                        type="button"
                        onClick={stopContinuousSpeechRecognition}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#c5221f] hover:bg-[#a51d19] text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 breathing-glow border-4 border-white"
                        aria-label="குரல் பதிவை நிறுத்தவும்"
                      >
                        <Square className="w-7 h-7 sm:w-8 sm:h-8 mb-0.5 fill-current" />
                        <span className="text-[10px] sm:text-xs font-black tracking-wider">நிறுத்து</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startContinuousSpeechRecognition}
                        disabled={isLoading}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#d95d39] hover:bg-[#a43716] text-white flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 breathing-glow border-4 border-white disabled:opacity-50"
                        aria-label="தமிழில் பேசத் தொடங்குங்கள்"
                      >
                        <Mic className="w-8 h-8 sm:w-9 sm:h-9 mb-0.5" />
                        <span className="text-[11px] sm:text-xs font-black">பேச தொடங்கு</span>
                      </button>
                    )}

                    <p className="mt-2.5 text-xs sm:text-sm font-bold text-[#58423c]">
                      {isListening
                        ? '🎙️ மைக் கேட்கிறது (ta-IN)... பேசி முடித்ததும் சிவப்பு பொத்தானை அழுத்தவும்'
                        : '👆 மைக்கை அழுத்தி உங்கள் வயது, குடும்ப நிலை, தொழிலை தமிழில் பேசுங்கள்'}
                    </p>
                  </div>

                  {speechError && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center justify-center gap-2 border border-[#ba1a1a]/30">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                  )}
                </div>

                {/* User Spoken Text Box: Live Updates as Speech is Recognized */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border sm:border-2 border-[#dfc0b7] shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-sm font-bold text-[#1f1b18] flex items-center gap-1.5">
                      <span>உங்கள் பேச்சு / பதிவு செய்யப்பட்ட உரை:</span>
                      {isListening && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#c5221f] font-bold">
                          <span className="w-2 h-2 rounded-full bg-[#c5221f] animate-ping" />
                          நேரலை பதிவாகிறது (Live Streaming)
                        </span>
                      )}
                    </label>

                    {userSpokenText && (
                      <button
                        type="button"
                        onClick={() => setUserSpokenText('')}
                        className="text-[11px] text-[#a43716] font-bold hover:underline"
                      >
                        அழி (Clear)
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={userSpokenText}
                      onChange={(e) => {
                        setUserSpokenText(e.target.value);
                        analyzeTamilSpeech(e.target.value);
                      }}
                      placeholder="உதாரணம்: எனக்கு 60 வயது, விவசாய கூலி வேலை செய்கிறேன், ஆண்டு வருமானம் ரூ. 1 லட்சத்திற்குள்..."
                      className="w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#fff8f5] border border-[#dfc0b7] focus:border-[#2b8282] focus:outline-none text-xs sm:text-sm text-[#1f1b18] font-medium resize-none"
                    />
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#58423c] font-semibold text-center sm:text-left">
                      <span>🔒 ஆதார், வங்கி விவரங்கள் தேவையில்லை</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEvaluate()}
                      disabled={isLoading}
                      className="tactile-button w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#d95d39] hover:bg-[#a43716] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Search className="w-4 h-4 stroke-[3]" />
                      <span>{isLoading ? 'கணக்கிடுகிறது...' : 'திட்டங்களை அறிய (கண்டுபிடி)'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Sample Prompts with 1-Click Fill & Instant Evaluate */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border sm:border-2 border-[#eae1dc] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#58423c]">
                      மாதிரி தமிழ் சூழல்கள் (தொட்டு உடனே தெரிந்து கொள்ள):
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplySample(p)}
                        className="tactile-button text-left p-2.5 sm:p-3 rounded-xl bg-[#fff8f5] hover:bg-[#fbf2ed] border border-[#dfc0b7] transition-all flex flex-col justify-between"
                      >
                        <span className="text-xs sm:text-sm font-bold text-[#a43716] flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3 shrink-0" /> {p.title}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#58423c] line-clamp-2">
                          "{p.text}"
                        </span>
                      </button>
                    ))}
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
      <footer className="w-full bg-white border-t border-[#eae1dc] py-3.5 px-3 sm:py-5 sm:px-4 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <p className="font-black text-[#1f1b18] text-xs sm:text-sm">
              வழிகாட்டி AI (Vazhikatti AI) - தமிழ்நாடு மக்கள் நலத்திட்ட வழிகாட்டி
            </p>
            <p className="text-[11px] sm:text-xs text-[#58423c]">
              தமிழ்நாடு அரசு நலத்திட்ட வழிகாட்டலுக்கான திறந்தநிலை இலவசப் பொதுச் சேவை.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs font-bold text-[#58423c]">
            <button
              onClick={() => setIsHelplineOpen(true)}
              className="hover:text-[#a43716] underline"
            >
              உதவி எண்கள் 1100
            </button>
            <span>•</span>
            <span className="text-[#2b8282]">100% தனியுரிமை</span>
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
