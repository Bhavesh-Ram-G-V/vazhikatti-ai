/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Phone, ShieldCheck, HeartHandshake, Baby, GraduationCap, Building2 } from 'lucide-react';

interface HelplineDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplineDirectory: React.FC<HelplineDirectoryProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const helplines = [
    {
      title: 'முதலமைச்சர் உதவி மையம் (CM Helpline)',
      number: '1100',
      desc: 'அனைத்து அரசு நலத்திட்டங்கள், புகார்கள் மற்றும் வழிகாட்டுதலுக்கு கட்டணமில்லா எண்.',
      icon: Building2,
      badge: 'கட்டணமில்லா சேவை',
    },
    {
      title: 'பெண்கள் உதவி மையம் (Women Helpline)',
      number: '181',
      desc: 'மகளிர் உதவித்தொகை, பாதுகாப்பு, உதவித் திட்டங்கள் மற்றும் அவசர உதவி.',
      icon: HeartHandshake,
      badge: '24 மணி நேரமும்',
    },
    {
      title: 'மூத்த குடிமக்கள் உதவி மையம் (Elder Line)',
      number: '14567',
      desc: 'முதியோர் ஓய்வூதியம், உதவி மற்றும் பராமரிப்பு ஆலோசனை.',
      icon: ShieldCheck,
      badge: 'முதியோர் சேவை',
    },
    {
      title: 'முதலமைச்சர் விரிவான மருத்துவக் காப்பீடு (CMCHIS)',
      number: '1800 425 3993',
      desc: 'ரூ. 5 லட்சம் மருத்துவ காப்பீட்டு அட்டை, அனுமதிக்கப்பட்ட மருத்துவமனைகள் விவரம்.',
      icon: Building2,
      badge: 'மருத்துவ உதவி',
    },
    {
      title: 'மாற்றுத்திறனாளிகள் உதவி மையம்',
      number: '1800 425 0111',
      desc: 'மாற்றுத்திறனாளிகள் பராமரிப்பு உதவித்தொகை, உபகரணங்கள் மற்றும் சலுகைகள்.',
      icon: ShieldCheck,
      badge: 'நலத்துறை',
    },
    {
      title: 'கல்வி மற்றும் மாணவர் உதவி (School / College)',
      number: '14417',
      desc: 'புதுமைப் பெண், தமிழ்ப் புதல்வன் மற்றும் கல்வி உதவித்தொகை வினவல்கள்.',
      icon: GraduationCap,
      badge: 'கல்வித்துறை',
    },
    {
      title: 'தாய் மற்றும் சேய் அவசர ஊர்தி சேவை',
      number: '102',
      desc: 'கர்ப்பிணித் தாய்மார்கள் மற்றும் பச்சிளம் குழந்தைகளுக்கான இலவச அரசு வாகனம்.',
      icon: Baby,
      badge: 'மருத்துவ ஊர்தி',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 sm:border-4 border-[#dfc0b7] shadow-2xl p-4 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0e6e1]">
          <div>
            <h2 className="text-base sm:text-2xl font-black text-[#1f1b18]">
              📞 தமிழ்நாடு அரசு இலவச உதவி எண்கள்
            </h2>
            <p className="text-[11px] sm:text-xs text-[#58423c]">
              கட்டணமில்லா எண்கள் - நேரடியாக அழைக்கலாம்.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="மூடு"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f5ece7] text-[#1f1b18] hover:bg-[#eae1dc] flex items-center justify-center font-bold shrink-0 ml-2"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="divide-y divide-[#f0e6e1] mt-2 sm:mt-4">
          {helplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="py-2.5 sm:py-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#fbf2ed] text-[#d95d39] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-[#1f1b18] text-xs sm:text-base leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#58423c] mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${item.number.replace(/\s+/g, '')}`}
                  className="tactile-button shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#2b8282] text-white font-extrabold text-xs sm:text-sm hover:bg-[#006a6a] shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>{item.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0e6e1] flex justify-end">
          <button
            onClick={onClose}
            className="tactile-button px-5 py-2 rounded-full bg-[#d95d39] text-white font-bold text-xs sm:text-sm shadow-sm"
          >
            மூடு (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
