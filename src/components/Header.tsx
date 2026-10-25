/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Volume2, VolumeX, Sparkles, PhoneCall } from 'lucide-react';
import { speakTamilText, stopSpeaking } from '../utils/audioHelper.ts';

interface HeaderProps {
  onOpenHelpline: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelpline }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioIntro = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const introText =
        'வணக்கம்! இது தமிழ்நாடு அரசு நலத்திட்ட வழிகாட்டி. உங்களுக்கு எந்தெந்த அரசு உதவித்தொகை, இலவச மருத்துவ காப்பீடு, மற்றும் உதவித்திட்டங்கள் கிடைக்கும் என்பதை எளிய முறையில் அறியலாம். உங்கள் ஆதார் எண் அல்லது வங்கி கணக்கு எதுவும் தேவை இல்லை. கீழே உள்ள பொத்தான்களை தொட்டு அல்லது மைக்கில் பேசி தெரிந்து கொள்ளலாம்.';
      speakTamilText(introText, setIsPlayingAudio);
    }
  };

  return (
    <header className="w-full bg-white border-b-2 border-[#eae1dc] shadow-sm sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#d95d39] to-[#a43716] flex items-center justify-center text-white shadow-md text-2xl font-bold border-2 border-white/80">
            <span>வ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1f1b18] tracking-tight">
                வழிகாட்டி AI
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fbf2ed] text-[#d95d39] border border-[#dfc0b7]">
                <Sparkles className="w-3 h-3" /> தமிழ்நாடு அரசு
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eef7f7] text-[#2b8282] border border-[#2b8282]/30">
                Gemma 4 31B IT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#58423c] font-medium">
              எளிய மக்கள் நலத்திட்ட வழிகாட்டி இயந்திரம் (Gemma 4 31B IT)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Audio voice intro button */}
          <button
            onClick={handleAudioIntro}
            aria-label="குரல் மூலம் பயன்பாட்டு விளக்கம் கேட்க"
            className={`tactile-button flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-all ${
              isPlayingAudio
                ? 'bg-[#d95d39] text-white border-[#a43716] breathing-glow'
                : 'bg-[#fff8f5] text-[#a43716] border-[#dfc0b7] hover:bg-[#fbf2ed]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-5 h-5 text-white animate-pulse" />
                <span>குரலை நிறுத்து</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-[#d95d39]" />
                <span>விளக்கம் கேட்க</span>
              </>
            )}
          </button>

          {/* Emergency Helpline button */}
          <button
            onClick={onOpenHelpline}
            aria-label="அரசு உதவி எண்களைக் காண"
            className="tactile-button flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-bold bg-[#f5ece7] text-[#1f1b18] hover:bg-[#eae1dc] border border-[#dfc0b7]"
          >
            <PhoneCall className="w-4 h-4 text-[#2b8282]" />
            <span className="hidden xs:inline">உதவி எண்கள்</span>
          </button>
        </div>
      </div>

      {/* Privacy guarantee bar */}
      <div className="bg-[#f0e6e1]/70 border-t border-[#eae1dc] py-1.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-[#58423c] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#2b8282] shrink-0" />
          <span>
            <strong>100% தனியுரிமை பாதுகாப்பு:</strong> ஆதார், தொலைபேசி அல்லது வங்கி எண்கள் இங்கு ஒருபோதும் சேகரிக்கப்படாது.
          </span>
        </div>
      </div>
    </header>
  );
};
