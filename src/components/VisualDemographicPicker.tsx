/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  User,
  HeartHandshake,
  GraduationCap,
  Tractor,
  Accessibility,
  Baby,
  Check,
  Plus,
  Minus,
  Sparkles,
  Search,
} from 'lucide-react';
import { CitizenProfile } from '../utils/tnSchemes.ts';

interface VisualDemographicPickerProps {
  profile: CitizenProfile;
  onChange: (updated: CitizenProfile) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const VisualDemographicPicker: React.FC<VisualDemographicPickerProps> = ({
  profile,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const primaryIdentities = [
    {
      id: 'head_of_family',
      labelTamil: profile.gender === 'male' ? 'குடும்பத் தலைவர் (ஆண்)' : 'பெண் / குடும்பத் தலைவி',
      subtextTamil: profile.gender === 'male' ? 'மருத்துவக் காப்பீடு, உழவர் பாதுகாப்பு' : 'உரிமைத்தொகை, மகளிர் திட்டங்கள்',
      icon: User,
      apply: (p: CitizenProfile) => ({
        ...p,
        age: p.age < 21 ? 25 : p.age,
        isPregnant: false,
      }),
      isSelected: (p: CitizenProfile) =>
        !p.isPregnant && p.occupation !== 'student_higher_edu' && p.age < 60 && !p.isDifferentlyAbled && p.occupation !== 'farmer',
    },
    {
      id: 'elder',
      labelTamil: 'மூத்த குடிமக்கள் (60+ வயது)',
      subtextTamil: 'முதியோர் ஓய்வூதியம் (OAP), காப்பீடு',
      icon: HeartHandshake,
      apply: (p: CitizenProfile) => ({
        ...p,
        age: Math.max(p.age, 65),
      }),
      isSelected: (p: CitizenProfile) => p.age >= 60,
    },
    {
      id: 'student',
      labelTamil: profile.gender === 'male' ? 'கல்லூரி மாணவர் (தமிழ்ப் புதல்வன்)' : 'கல்லூரி மாணவி / மாணவர்',
      subtextTamil: profile.gender === 'male' ? 'மாதம் ரூ. 1,000 தமிழ்ப் புதல்வன் திட்டம்' : 'புதுமைப் பெண், தமிழ்ப் புதல்வன்',
      icon: GraduationCap,
      apply: (p: CitizenProfile) => ({
        ...p,
        age: 19,
        occupation: 'student_higher_edu' as const,
        studiedGovtSchool: true,
        isEnrolledHigherEdu: true,
      }),
      isSelected: (p: CitizenProfile) =>
        p.occupation === 'student_higher_edu' || p.isEnrolledHigherEdu === true,
    },
    {
      id: 'farmer',
      labelTamil: 'விவசாயி / விவசாயக் கூலி',
      subtextTamil: 'முதலமைச்சரின் உழவர் பாதுகாப்பு அட்டை திட்டம்',
      icon: Tractor,
      apply: (p: CitizenProfile) => ({
        ...p,
        occupation: 'farmer' as const,
        age: p.age < 18 ? 40 : p.age,
      }),
      isSelected: (p: CitizenProfile) =>
        p.occupation === 'farmer' || p.occupation === 'agricultural_labor',
    },
    {
      id: 'disabled',
      labelTamil: 'மாற்றுத்திறனாளி (40%+)',
      subtextTamil: 'மாதாந்திர பராமரிப்பு உதவித்தொகை',
      icon: Accessibility,
      apply: (p: CitizenProfile) => ({
        ...p,
        isDifferentlyAbled: !p.isDifferentlyAbled,
      }),
      isSelected: (p: CitizenProfile) => p.isDifferentlyAbled === true,
    },
    ...(profile.gender !== 'male'
      ? [
          {
            id: 'pregnant',
            labelTamil: 'கர்ப்பிணித் தாய்',
            subtextTamil: 'முத்துலட்சுமி ரெட்டி மகப்பேறு உதவி',
            icon: Baby,
            apply: (p: CitizenProfile) => ({
              ...p,
              gender: 'female' as const,
              age: p.age < 19 ? 24 : p.age,
              isPregnant: true,
            }),
            isSelected: (p: CitizenProfile) => p.gender === 'female' && p.isPregnant === true,
          },
        ]
      : []),
  ];

  const incomeTiers = [
    {
      id: 'below_1_lakh',
      titleTamil: 'ஆண்டுக்கு ரூ. 1 லட்சத்திற்குள்',
      badgeTamil: 'வறுமைக் கோட்டிற்கு கீழ் (BPL)',
      descTamil: 'ஓய்வூதியம், திருமணம் மற்றும் அனைத்து நலத்திட்டங்களுக்கும் தகுதி',
    },
    {
      id: 'below_2_5_lakh',
      titleTamil: 'ரூ. 1 லட்சம் முதல் 2.5 லட்சம் வரை',
      badgeTamil: 'எளிய நடுத்தர குடும்பம்',
      descTamil: 'மருத்துவக் காப்பீடு, மாணவர் கல்வி உதவி, உரிமைத்தொகை',
    },
    {
      id: 'above_2_5_lakh',
      titleTamil: 'ஆண்டுக்கு ரூ. 2.5 லட்சத்திற்கு மேல்',
      badgeTamil: 'வருமான வரி / அதிக வருமானம்',
      descTamil: 'பொதுவான நலத்திட்டங்கள் மட்டும்',
    },
  ];

  const maritalOptions =
    profile.gender === 'male'
      ? [
          { id: 'married', label: 'திருமணமானவர்' },
          { id: 'unmarried', label: 'திருமணம் ஆகாதவர்' },
          { id: 'widow', label: 'மனைவியை இழந்தவர் (Widower)' },
        ]
      : [
          { id: 'widow', label: 'விதவை / கணவரை இழந்தவர்' },
          { id: 'destitute_widow', label: 'ஆதரவற்ற விதவை' },
          { id: 'married', label: 'திருமணமானவர்' },
          { id: 'unmarried', label: 'திருமணம் ஆகாதவர்' },
        ];

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Step 1: Who are you (Visual choice cards) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border sm:border-2 border-[#eae1dc] shadow-xs sm:shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf2ed] text-[#d95d39] font-black flex items-center justify-center text-xs sm:text-sm border border-[#dfc0b7] shrink-0">
            1
          </span>
          <h2 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
            முதலில் நீங்கள் யார் என்பதைத் தொடவும்
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#58423c] mb-3.5 sm:mb-5">
          கீழே உள்ள படக் கட்டங்களில் பொருத்தமானதை ஒருமுறை தொடவும்.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {primaryIdentities.map((item) => {
            const Icon = item.icon;
            const active = item.isSelected(profile);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.apply(profile))}
                className={`tactile-button relative min-h-[72px] sm:min-h-[105px] p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex items-center sm:items-start justify-between gap-3 ${
                  active
                    ? 'bg-[#2b8282] text-white border-[#006a6a] shadow-sm'
                    : 'bg-[#fff8f5] text-[#1f1b18] border-[#eae1dc] hover:border-[#dfc0b7] hover:bg-[#fbf2ed]'
                }`}
              >
                <div className="flex items-center sm:items-start gap-3 w-full">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      active ? 'bg-white/20 text-white' : 'bg-[#f5ece7] text-[#d95d39]'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="block text-sm sm:text-base font-bold leading-snug truncate sm:whitespace-normal">
                      {item.labelTamil}
                    </span>
                    <span
                      className={`block text-[11px] sm:text-xs mt-0.5 line-clamp-1 ${
                        active ? 'text-white/80' : 'text-[#58423c]'
                      }`}
                    >
                      {item.subtextTamil}
                    </span>
                  </div>

                  {active && (
                    <div className="w-6 h-6 rounded-full bg-white text-[#2b8282] flex items-center justify-center font-bold shadow-xs shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Age & Family Status */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border sm:border-2 border-[#eae1dc] shadow-xs sm:shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf2ed] text-[#d95d39] font-black flex items-center justify-center text-xs sm:text-sm border border-[#dfc0b7] shrink-0">
            2
          </span>
          <h2 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
            வயது மற்றும் குடும்ப நிலை
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 mt-3 sm:mt-5">
          {/* Age selector with big buttons */}
          <div className="bg-[#fff8f5] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#dfc0b7]">
            <label className="block text-xs sm:text-sm font-bold text-[#1f1b18] mb-2">
              உங்கள் வயது (Age in years):
            </label>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onChange({ ...profile, age: Math.max(15, profile.age - 1) })}
                aria-label="வயதை 1 குறைக்க"
                className="tactile-button w-12 h-12 rounded-full bg-white border border-[#dfc0b7] text-[#a43716] flex items-center justify-center hover:bg-[#fbf2ed] shadow-xs font-black text-xl"
              >
                <Minus className="w-5 h-5 stroke-[3]" />
              </button>

              <div className="flex-1 text-center bg-white py-2 px-3 rounded-xl border border-[#2b8282]">
                <span className="text-2xl sm:text-3xl font-black text-[#1f1b18]">
                  {profile.age}
                </span>
                <span className="block text-[10px] sm:text-xs text-[#58423c] font-semibold">
                  {profile.age >= 60 ? 'மூத்த குடிமக்கள்' : profile.age >= 21 ? 'குடும்பத் தலைமை' : 'இளைஞர்'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onChange({ ...profile, age: Math.min(100, profile.age + 1) })}
                aria-label="வயதை 1 கூட்ட"
                className="tactile-button w-12 h-12 rounded-full bg-white border border-[#dfc0b7] text-[#a43716] flex items-center justify-center hover:bg-[#fbf2ed] shadow-xs font-black text-xl"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Quick age bracket chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[19, 25, 40, 60, 65].map((ageVal) => (
                <button
                  key={ageVal}
                  type="button"
                  onClick={() => onChange({ ...profile, age: ageVal })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                    profile.age === ageVal
                      ? 'bg-[#2b8282] text-white border-[#2b8282]'
                      : 'bg-white text-[#58423c] border-[#dfc0b7] hover:bg-[#f5ece7]'
                  }`}
                >
                  {ageVal} வயது
                </button>
              ))}
            </div>
          </div>

          {/* Marital / Family condition */}
          <div className="bg-[#fff8f5] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#dfc0b7]">
            <label className="block text-xs sm:text-sm font-bold text-[#1f1b18] mb-2">
              குடும்ப நிலை (Marital Status):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {maritalOptions.map((opt) => {
                const isSelected = profile.maritalStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...profile,
                        maritalStatus: isSelected ? 'any' : (opt.id as any),
                      })
                    }
                    className={`tactile-button p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#2b8282] text-white border-[#006a6a]'
                        : 'bg-white text-[#1f1b18] border-[#dfc0b7] hover:bg-[#fbf2ed]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Income Bracket */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border sm:border-2 border-[#eae1dc] shadow-xs sm:shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf2ed] text-[#d95d39] font-black flex items-center justify-center text-xs sm:text-sm border border-[#dfc0b7] shrink-0">
            3
          </span>
          <h2 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
            குடும்ப ஆண்டு வருமானம்
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#58423c] mb-3 sm:mb-4">
          அரசு நலத்திட்டங்களுக்கு வருமான வரம்பு மிக முக்கியம்.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {incomeTiers.map((tier) => {
            const isSelected = profile.annualIncome === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onChange({ ...profile, annualIncome: tier.id as any })}
                className={`tactile-button p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#2b8282] text-white border-[#006a6a] shadow-sm'
                    : 'bg-[#fff8f5] text-[#1f1b18] border-[#eae1dc] hover:border-[#dfc0b7] hover:bg-[#fbf2ed]'
                }`}
              >
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#fbf2ed] text-[#a43716] border border-[#dfc0b7]'
                    }`}
                  >
                    {tier.badgeTamil}
                  </span>
                  <span className="block text-sm sm:text-base font-extrabold leading-snug">
                    {tier.titleTamil}
                  </span>
                </div>
                <span
                  className={`block text-[11px] mt-1.5 ${
                    isSelected ? 'text-white/80' : 'text-[#58423c]'
                  }`}
                >
                  {tier.descTamil}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 4: Special Checkboxes */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border sm:border-2 border-[#eae1dc] shadow-xs sm:shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf2ed] text-[#d95d39] font-black flex items-center justify-center text-xs sm:text-sm border border-[#dfc0b7] shrink-0">
            4
          </span>
          <h2 className="text-base sm:text-xl font-black text-[#1f1b18] leading-tight">
            கூடுதல் தகுதிகள் (பொருந்தினால் தொடவும்)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mt-3">
          {/* Govt School 6th to 12th */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...profile,
                studiedGovtSchool: !profile.studiedGovtSchool,
              })
            }
            className={`tactile-button p-3 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
              profile.studiedGovtSchool
                ? 'bg-[#2b8282] text-white border-[#006a6a]'
                : 'bg-[#fff8f5] text-[#1f1b18] border-[#dfc0b7] hover:bg-[#fbf2ed]'
            }`}
          >
            <span>6 முதல் 12 ஆம் வகுப்பு அரசுப் பள்ளி படிப்பு</span>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                profile.studiedGovtSchool
                  ? 'bg-white text-[#2b8282] border-white'
                  : 'bg-white border-[#8b716a]'
              }`}
            >
              {profile.studiedGovtSchool && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Uzhavar / Landless labor */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...profile,
                occupation:
                  profile.occupation === 'farmer' ? 'other' : 'farmer',
              })
            }
            className={`tactile-button p-3 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
              profile.occupation === 'farmer' || profile.occupation === 'agricultural_labor'
                ? 'bg-[#2b8282] text-white border-[#006a6a]'
                : 'bg-[#fff8f5] text-[#1f1b18] border-[#dfc0b7] hover:bg-[#fbf2ed]'
            }`}
          >
            <span>விவசாயம் அல்லது கூலி வேலை செய்பவர்</span>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                profile.occupation === 'farmer' || profile.occupation === 'agricultural_labor'
                  ? 'bg-white text-[#2b8282] border-white'
                  : 'bg-white border-[#8b716a]'
              }`}
            >
              {(profile.occupation === 'farmer' || profile.occupation === 'agricultural_labor') && (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              )}
            </div>
          </button>

          {/* Daughter marriage assistance */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...profile,
                hasDaughterMarriageSoon: !profile.hasDaughterMarriageSoon,
              })
            }
            className={`tactile-button p-3 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
              profile.hasDaughterMarriageSoon
                ? 'bg-[#2b8282] text-white border-[#006a6a]'
                : 'bg-[#fff8f5] text-[#1f1b18] border-[#dfc0b7] hover:bg-[#fbf2ed]'
            }`}
          >
            <span>விரைவில் பெண் திருமணம் (திருமண உதவி)</span>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                profile.hasDaughterMarriageSoon
                  ? 'bg-white text-[#2b8282] border-white'
                  : 'bg-white border-[#8b716a]'
              }`}
            >
              {profile.hasDaughterMarriageSoon && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        </div>
      </section>

      {/* Giant CTA Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          aria-label="உங்களுக்கு உகந்த அரசு நலத்திட்டங்களை அறிய இங்கே அழுத்தவும்"
          className="w-full min-h-[58px] sm:min-h-[68px] rounded-full bg-[#d95d39] hover:bg-[#a43716] text-white flex items-center justify-center gap-2.5 text-base sm:text-xl font-black shadow-lg tactile-button breathing-glow transition-all active:translate-y-1 disabled:opacity-50 border-3 border-white"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>மதிப்பீடு செய்கிறது...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-5 h-5 stroke-[3]" />
              <span>நலத்திட்டங்களைக் கண்டறியுங்கள்</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
