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
    <div className="w-full space-y-6 animate-fadeIn pb-12">
      {/* Top Banner with Big Listen Audio Button */}
      <div className="bg-gradient-to-r from-[#d95d39] to-[#a43716] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider mb-2">
              தகுதி மதிப்பீடு முடிவுகள் (Evaluation Results)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              உங்களுக்கான தமிழ்நாடு அரசு நலத்திட்டங்கள் தயாராக உள்ளன!
            </h2>
            <p className="text-white/90 text-sm sm:text-base mt-1">
              படிக்க சிரமமாக இருந்தால் கீழே உள்ள 'குரலில் கேட்க' பொத்தானைத் தொடவும்.
            </p>
          </div>

          {/* Giant Audio Play/Stop Button */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-label="முடிவுகளை குரலில் கேட்க அல்லது நிறுத்த"
            className={`tactile-button shrink-0 min-h-[68px] px-6 py-4 rounded-full font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg border-2 border-white transition-all ${
              isPlayingAudio
                ? 'bg-[#1f1b18] text-white breathing-glow'
                : 'bg-white text-[#a43716] hover:bg-[#fff8f5]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-7 h-7 text-[#d95d39] animate-pulse" />
                <span>குரலை நிறுத்து</span>
              </>
            ) : (
              <>
                <Volume2 className="w-7 h-7 text-[#d95d39]" />
                <span>குரலில் கேட்க (Listen Aloud)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strict Markdown Render Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#eae1dc] shadow-sm space-y-8">
        {/* Section 1: Eligible Schemes */}
        <div className="border-b-2 border-[#f0e6e1] pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] text-[#d95d39] flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1f1b18]">
              🏛️ உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)
            </h3>
          </div>

          <div className="space-y-4">
            {matchedSchemes.length > 0 ? (
              matchedSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-5 rounded-2xl bg-[#fff8f5] border-2 border-[#dfc0b7] hover:border-[#d95d39] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#a43716]">
                      {scheme.nameTamil}
                    </h4>
                    {scheme.amountTamil && (
                      <span className="inline-block px-3 py-1 rounded-full bg-[#2b8282] text-white font-black text-xs sm:text-sm self-start sm:self-auto">
                        {scheme.amountTamil}
                      </span>
                    )}
                  </div>
                  <p className="text-[#1f1b18] text-base sm:text-lg font-medium leading-relaxed">
                    {scheme.benefitDescriptionTamil}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#dfc0b7]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#58423c]">
                    <span>தொடர்புக்கு: {scheme.officeToContactTamil}</span>
                    <span className="text-[#2b8282] font-bold">உதவி எண்: {scheme.helpline}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-2xl bg-[#fff8f5] border-2 border-[#dfc0b7]">
                <h4 className="text-lg font-bold text-[#a43716]">
                  முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)
                </h4>
                <p className="text-[#1f1b18] text-base mt-1">
                  குடும்பத்திற்கு ஆண்டுக்கு ரூ. 5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை மற்றும் அறுவை சிகிச்சை காப்பீடு.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Required Documents with Interactive Checklist */}
        <div className="border-b-2 border-[#f0e6e1] pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef7f7] text-[#2b8282] flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1f1b18]">
                📋 தேவையான ஆவணங்கள் (Required Documents)
              </h3>
              <p className="text-xs sm:text-sm text-[#58423c]">
                உங்களிடம் உள்ள ஆவணங்களை ஒருமுறை தொட்டு சரிபார்க்கவும் (Checklist).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {allDocuments.map((doc, idx) => {
              const isChecked = !!checkedDocs[doc];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDocCheck(doc)}
                  className={`tactile-button p-4 rounded-2xl border-2 text-left flex items-start justify-between gap-3 transition-all ${
                    isChecked
                      ? 'bg-[#2b8282] text-white border-[#006a6a]'
                      : 'bg-[#fff8f5] text-[#1f1b18] border-[#dfc0b7] hover:bg-[#fbf2ed]'
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold leading-snug">
                    • {doc}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                      isChecked
                        ? 'bg-white text-[#2b8282] border-white'
                        : 'bg-white border-[#8b716a]'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-5 h-5 fill-[#2b8282] text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Next Steps */}
        <div className="border-b-2 border-[#f0e6e1] pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] text-[#d95d39] flex items-center justify-center font-bold">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1f1b18]">
              📌 அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)
            </h3>
          </div>

          <ol className="space-y-3">
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-[#fff8f5] border border-[#dfc0b7]">
              <span className="w-7 h-7 rounded-full bg-[#d95d39] text-white font-black text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-base font-semibold text-[#1f1b18] pt-0.5">
                அருகில் உள்ள அரசு e-Seva மையத்திற்கு உங்கள் குடும்ப அட்டை மற்றும் சான்றிதழ்களுடன் செல்லவும்.
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-[#fff8f5] border border-[#dfc0b7]">
              <span className="w-7 h-7 rounded-full bg-[#d95d39] text-white font-black text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-base font-semibold text-[#1f1b18] pt-0.5">
                கிராம நிர்வாக அலுவலரிடம் (VAO) அல்லது வருவாய் ஆய்வாளரிடம் (RI) வருமான / ஆதரவற்றோர் சான்றிதழ் பெறவும்.
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-[#fff8f5] border border-[#dfc0b7]">
              <span className="w-7 h-7 rounded-full bg-[#d95d39] text-white font-black text-sm flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-base font-semibold text-[#1f1b18] pt-0.5">
                விண்ணப்பத்தை e-Seva மையத்தில் சமர்ப்பித்து ரசீது எண் (Acknowledgement Slip) பெற்று பத்திரப்படுத்தவும்.
              </span>
            </li>
          </ol>
        </div>

        {/* Section 4: Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#f5ece7] border-2 border-[#dfc0b7] flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[#a43716] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium text-[#58423c] leading-relaxed">
            <p className="font-bold text-[#1f1b18] mb-1">
              ⚠️ முக்கிய குறிப்பு (Disclaimer)
            </p>
            <p>
              இது ஒரு வழிகாட்டி தகவல் மட்டுமே. இறுதி முடிவுக்கு உங்கள் உள்ளூர் VAO அலுவலகம் அல்லது e-Seva மையத்தை அணுகவும். தேவைப்பட்டால் கூடுதல் ஆவணங்களைச் சரிபார்க்கவும்.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky-like Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white p-4 rounded-3xl border-2 border-[#dfc0b7] shadow-md">
        <button
          type="button"
          onClick={onReset}
          className="tactile-button w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#fff8f5] hover:bg-[#fbf2ed] text-[#a43716] border-2 border-[#dfc0b7] font-bold text-base flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>புதிய மதிப்பீடு செய்ய</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenHelpline}
            className="tactile-button flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-[#f0e6e1] hover:bg-[#eae1dc] text-[#1f1b18] border border-[#dfc0b7] font-bold text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 text-[#2b8282]" />
            <span>அரசு உதவி எண் 1100</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="tactile-button flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-[#2b8282] hover:bg-[#006a6a] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md"
          >
            <Printer className="w-5 h-5" />
            <span>அச்சு / சேமிக்க</span>
          </button>
        </div>
      </div>
    </div>
  );
};
