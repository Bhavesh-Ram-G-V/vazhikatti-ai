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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#dfc0b7] shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0e6e1]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1f1b18]">
              📞 தமிழ்நாடு அரசு இலவச உதவி எண்கள்
            </h2>
            <p className="text-xs sm:text-sm text-[#58423c]">
              எந்த கட்டணமும் இன்றி உங்கள் தொலைபேசியில் இருந்து நேரடியாக அழைக்கலாம்.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="மூடு"
            className="w-10 h-10 rounded-full bg-[#f5ece7] text-[#1f1b18] hover:bg-[#eae1dc] flex items-center justify-center font-bold"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="divide-y divide-[#f0e6e1] mt-4">
          {helplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] text-[#d95d39] flex items-center justify-center shrink-0 mt-1">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-[#1f1b18] text-base sm:text-lg">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#58423c] mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${item.number.replace(/\s+/g, '')}`}
                  className="tactile-button shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-[#2b8282] text-white font-extrabold text-sm sm:text-base hover:bg-[#006a6a] shadow-sm"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>{item.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#f0e6e1] flex justify-end">
          <button
            onClick={onClose}
            className="tactile-button px-6 py-2.5 rounded-full bg-[#d95d39] text-white font-bold text-sm shadow-md"
          >
            மூடு (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
