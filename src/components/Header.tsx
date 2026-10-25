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
    <header className="w-full bg-white border-b border-[#eae1dc] shadow-xs sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#d95d39] to-[#a43716] flex items-center justify-center text-white shadow-sm text-lg sm:text-2xl font-black shrink-0 border border-white">
            <span>வ</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-xl font-black text-[#1f1b18] tracking-tight truncate">
                வழிகாட்டி AI
              </h1>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#fbf2ed] text-[#d95d39] border border-[#dfc0b7] shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> TN Govt
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef7f7] text-[#2b8282] border border-[#2b8282]/30">
                Gemma 4 31B IT
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#58423c] font-medium truncate">
              மக்கள் நலத்திட்ட வழிகாட்டி
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio voice intro button */}
          <button
            onClick={handleAudioIntro}
            aria-label="குரல் மூலம் விளக்கம் கேட்க"
            className={`tactile-button flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border transition-all ${
              isPlayingAudio
                ? 'bg-[#d95d39] text-white border-[#a43716] breathing-glow'
                : 'bg-[#fff8f5] text-[#a43716] border-[#dfc0b7] hover:bg-[#fbf2ed]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-white animate-pulse" />
                <span className="text-xs">நிறுத்து</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#d95d39]" />
                <span className="text-xs">விளக்கம்</span>
              </>
            )}
          </button>

          {/* Emergency Helpline button */}
          <button
            onClick={onOpenHelpline}
            aria-label="அரசு உதவி எண்களைக் காண"
            className="tactile-button flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-[#f5ece7] text-[#1f1b18] hover:bg-[#eae1dc] border border-[#dfc0b7]"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#2b8282]" />
            <span className="text-xs">1100</span>
          </button>
        </div>
      </div>

      {/* Slim Privacy guarantee pill */}
      <div className="bg-[#f0e6e1]/60 border-t border-[#eae1dc]/80 py-1 px-3">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-[#58423c] font-medium text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2b8282] shrink-0" />
          <span className="truncate">
            <strong>100% தனியுரிமை:</strong> ஆதார் அல்லது வங்கி எண்கள் தேவையில்லை.
          </span>
        </div>
      </div>
    </header>
  );
};
