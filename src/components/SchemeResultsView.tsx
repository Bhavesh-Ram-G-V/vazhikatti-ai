/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Printer,
  RotateCcw,
  Building2,
  FileText,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Share2,
} from 'lucide-react';
import { Scheme } from '../utils/tnSchemes.ts';
import { speakTamilText, stopSpeaking } from '../utils/audioHelper.ts';

interface SchemeResultsViewProps {
  markdownOutput: string;
  matchedSchemes: Scheme[];
  onReset: () => void;
  onOpenHelpline: () => void;
}

export const SchemeResultsView: React.FC<SchemeResultsViewProps> = ({
  markdownOutput,
  matchedSchemes,
  onReset,
  onOpenHelpline,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      speakTamilText(markdownOutput, setIsPlayingAudio);
    }
  };

  const toggleDocCheck = (doc: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Extract all documents from matched schemes for interactive checklist
  const allDocuments = Array.from(
    new Set(
      matchedSchemes.length > 0
        ? matchedSchemes.flatMap((s) => s.documentsTamil)
        : [
            'ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card)',
            'வருமானச் சான்றிதழ் (VAO / தாசில்தார்)',
            'ஆதார் அட்டை (சரிபார்ப்புக்கு மட்டும்)',
            'வங்கிக் கணக்கு புத்தகம்',
          ]
    )
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fadeIn pb-16">
      {/* Top Banner with Big Listen Audio Button */}
      <div className="bg-gradient-to-r from-[#d95d39] to-[#a43716] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-lg border-2 sm:border-4 border-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1.5">
              மதிப்பீடு முடிவுகள் (Evaluation Results)
            </span>
            <h2 className="text-lg sm:text-2xl font-black leading-snug">
              உங்களுக்கான தமிழ்நாடு அரசு நலத்திட்டங்கள்!
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-0.5">
              படிக்க சிரமமாக இருந்தால் 'குரலில் கேட்க' பொத்தானைத் தொடவும்.
            </p>
          </div>

          {/* Giant Audio Play/Stop Button */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-label="முடிவுகளை குரலில் கேட்க அல்லது நிறுத்த"
            className={`tactile-button shrink-0 w-full sm:w-auto min-h-[52px] sm:min-h-[62px] px-5 py-3 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md border-2 border-white transition-all ${
              isPlayingAudio
                ? 'bg-[#1f1b18] text-white breathing-glow'
                : 'bg-white text-[#a43716] hover:bg-[#fff8f5]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-5 h-5 text-[#d95d39] animate-pulse" />
                <span>குரலை நிறுத்து</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-[#d95d39]" />
                <span>குரலில் கேட்க (Listen Aloud)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strict Markdown Render Sections */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border sm:border-2 border-[#eae1dc] shadow-xs sm:shadow-sm space-y-5 sm:space-y-7">
        {/* Section 1: Eligible Schemes */}
        <div className="border-b border-[#f0e6e1] pb-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#fbf2ed] text-[#d95d39] flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
              🏛️ உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)
            </h3>
          </div>

          <div className="space-y-3">
            {matchedSchemes.length > 0 ? (
              matchedSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#fff8f5] border border-[#dfc0b7] hover:border-[#d95d39] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                    <h4 className="text-base sm:text-lg font-black text-[#a43716]">
                      {scheme.nameTamil}
                    </h4>
                    {scheme.amountTamil && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2b8282] text-white font-black text-[11px] sm:text-xs self-start sm:self-auto">
                        {scheme.amountTamil}
                      </span>
                    )}
                  </div>
                  <p className="text-[#1f1b18] text-xs sm:text-sm font-medium leading-relaxed">
                    {scheme.benefitDescriptionTamil}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#dfc0b7]/50 flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-semibold text-[#58423c]">
                    <span>தொடர்புக்கு: {scheme.officeToContactTamil}</span>
                    <span className="text-[#2b8282] font-bold">உதவி: {scheme.helpline}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#fff8f5] border border-[#dfc0b7]">
                <h4 className="text-base font-bold text-[#a43716]">
                  முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)
                </h4>
                <p className="text-[#1f1b18] text-xs sm:text-sm mt-1">
                  குடும்பத்திற்கு ஆண்டுக்கு ரூ. 5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை மற்றும் அறுவை சிகிச்சை காப்பீடு.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Required Documents with Interactive Checklist */}
        <div className="border-b border-[#f0e6e1] pb-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#eef7f7] text-[#2b8282] flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
                📋 தேவையான ஆவணங்கள் (Required Documents)
              </h3>
              <p className="text-[11px] sm:text-xs text-[#58423c]">
                உங்களிடம் உள்ள ஆவணங்களைத் தொட்டு சரிபார்க்கவும் (Checklist).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mt-3">
            {allDocuments.map((doc, idx) => {
              const isChecked = !!checkedDocs[doc];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDocCheck(doc)}
                  className={`tactile-button p-3 rounded-xl border text-left flex items-start justify-between gap-2.5 transition-all ${
                    isChecked
                      ? 'bg-[#2b8282] text-white border-[#006a6a]'
                      : 'bg-[#fff8f5] text-[#1f1b18] border-[#dfc0b7] hover:bg-[#fbf2ed]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold leading-snug">
                    • {doc}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border shrink-0 mt-0.5 flex items-center justify-center ${
                      isChecked
                        ? 'bg-white text-[#2b8282] border-white'
                        : 'bg-white border-[#8b716a]'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-4 h-4 fill-[#2b8282] text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Next Steps */}
        <div className="border-b border-[#f0e6e1] pb-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#fbf2ed] text-[#d95d39] flex items-center justify-center font-bold shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
              📌 அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)
            </h3>
          </div>

          <ol className="space-y-2 sm:space-y-2.5">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fff8f5] border border-[#dfc0b7]">
              <span className="w-6 h-6 rounded-full bg-[#d95d39] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#1f1b18]">
                அருகில் உள்ள அரசு e-Seva மையத்திற்கு உங்கள் குடும்ப அட்டை மற்றும் சான்றிதழ்களுடன் செல்லவும்.
              </span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fff8f5] border border-[#dfc0b7]">
              <span className="w-6 h-6 rounded-full bg-[#d95d39] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#1f1b18]">
                கிராம நிர்வாக அலுவலரிடம் (VAO) அல்லது வருவாய் ஆய்வாளரிடம் (RI) வருமான / ஆதரவற்றோர் சான்றிதழ் பெறவும்.
              </span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fff8f5] border border-[#dfc0b7]">
              <span className="w-6 h-6 rounded-full bg-[#d95d39] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#1f1b18]">
                விண்ணப்பத்தை e-Seva மையத்தில் சமர்ப்பித்து ரசீது எண் (Acknowledgement Slip) பெற்று பத்திரப்படுத்தவும்.
              </span>
            </li>
          </ol>
        </div>

        {/* Section 4: Disclaimer */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#f5ece7] border border-[#dfc0b7] flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-[#a43716] shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs font-medium text-[#58423c] leading-relaxed">
            <p className="font-bold text-[#1f1b18] mb-0.5">
              ⚠️ முக்கிய குறிப்பு (Disclaimer)
            </p>
            <p>
              இது ஒரு வழிகாட்டி தகவல் மட்டுமே. இறுதி முடிவுக்கு உங்கள் உள்ளூர் VAO அலுவலகம் அல்லது e-Seva மையத்தை அணுகவும். தேவைப்பட்டால் கூடுதல் ஆவணங்களைச் சரிபார்க்கவும்.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar on Mobile */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-between bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#dfc0b7] shadow-sm">
        <button
          type="button"
          onClick={onReset}
          className="tactile-button w-full sm:w-auto px-4 py-3 rounded-full bg-[#fff8f5] hover:bg-[#fbf2ed] text-[#a43716] border border-[#dfc0b7] font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>புதிய மதிப்பீடு செய்ய</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenHelpline}
            className="tactile-button flex-1 sm:flex-initial px-4 py-3 rounded-full bg-[#f0e6e1] hover:bg-[#eae1dc] text-[#1f1b18] border border-[#dfc0b7] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-[#2b8282]" />
            <span>உதவி எண் 1100</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="tactile-button flex-1 sm:flex-initial px-4 py-3 rounded-full bg-[#2b8282] hover:bg-[#006a6a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>அச்சு / சேமிக்க</span>
          </button>
        </div>
      </div>
    </div>
  );
};
