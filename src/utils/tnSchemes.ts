/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CitizenProfile {
  age: number;
  gender: 'female' | 'male' | 'transgender' | 'any';
  maritalStatus?: 'unmarried' | 'married' | 'widow' | 'destitute_widow' | 'deserted' | 'any';
  annualIncome: 'below_1_lakh' | 'below_2_5_lakh' | 'above_2_5_lakh';
  occupation?: 'farmer' | 'agricultural_labor' | 'student_higher_edu' | 'unemployed' | 'daily_wage' | 'other';
  studiedGovtSchool?: boolean;
  isDifferentlyAbled?: boolean;
  isEnrolledHigherEdu?: boolean;
  isPregnant?: boolean;
  hasDaughterMarriageSoon?: boolean;
}

export interface Scheme {
  id: string;
  nameTamil: string;
  nameEnglish: string;
  benefitDescriptionTamil: string;
  category: 'women' | 'elderly' | 'education' | 'agriculture' | 'health' | 'differently_abled' | 'social_security';
  amountTamil?: string;
  documentsTamil: string[];
  nextStepsTamil: string[];
  officeToContactTamil: string;
  helpline: string;
  checkEligibility: (profile: CitizenProfile) => boolean;
}

export const TN_SCHEMES: Scheme[] = [
  {
    id: 'kmuy',
    nameTamil: 'கலைஞர் மகளிர் உரிமைத் திட்டம்',
    nameEnglish: 'Kalaignar Magalir Urimai Thittam',
    benefitDescriptionTamil: 'குடும்பத் தலைவிகளுக்கு மாதம் தோறும் ரூ. 1,000 உரிமைத் தொகை நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படுகிறது.',
    category: 'women',
    amountTamil: 'ரூ. 1,000 / மாதம்',
    documentsTamil: [
      'ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card)',
      'ஆதார் அட்டை (சரிபார்ப்புக்கு மட்டும்)',
      'வங்கிக் கணக்கு புத்தகம் (Bank Passbook)',
      'மின் கட்டண ரசீது (Electricity Bill)',
    ],
    nextStepsTamil: [
      'அருகில் உள்ள நியாயவிலைக் கடையில் (Ration Shop) வழங்கப்படும் விண்ணப்பப் படிவத்தைப் பெறவும்.',
      'படிவத்தைப் பூர்த்தி செய்து உங்கள் கிராம/வார்டு சிறப்பு முகாமில் சமர்ப்பித்து கைரேகை பதிவு செய்யவும்.',
    ],
    officeToContactTamil: 'கிராம நிர்வாக அலுவலர் (VAO) / நியாயவிலைக் கடை / சிறப்பு முகாம்',
    helpline: '1100 (முதலமைச்சர் உதவி மையம்)',
    checkEligibility: (p) => {
      const isFemale = p.gender === 'female' || p.gender === 'transgender';
      const isAdult = p.age >= 21;
      const isLowIncome = p.annualIncome === 'below_1_lakh' || p.annualIncome === 'below_2_5_lakh';
      return isFemale && isAdult && isLowIncome;
    },
  },
  {
    id: 'pudhumai_penn',
    nameTamil: 'புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் உயர்கல்வி உறுதித் திட்டம்)',
    nameEnglish: 'Pudhumai Penn Scheme',
    benefitDescriptionTamil: 'அரசுப் பள்ளியில் படித்துக் கல்லூரிக்குச் செல்லும் மாணவிகளுக்கு மாதம் ரூ. 1,000 கல்வி உதவித்தொகை வழங்கப்படுகிறது.',
    category: 'education',
    amountTamil: 'ரூ. 1,000 / மாதம்',
    documentsTamil: [
      '6 முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான சான்றிதழ்',
      'கல்லூரி சேர்க்கை அட்டை மற்றும் அடையாள அட்டை',
      'ஸ்மார்ட் குடும்ப அட்டை',
      'வங்கிக் கணக்கு விவரம்',
    ],
    nextStepsTamil: [
      'நீங்கள் பயிலும் கல்லூரியின் புதுமைப் பெண் திட்ட பொறுப்பாளரை (Nodal Officer) அணுகவும்.',
      'அரசுப் பள்ளி சான்றிதழை சமர்ப்பித்து கல்லூரி வாயிலாக இணையதளத்தில் பதிவு செய்யவும்.',
    ],
    officeToContactTamil: 'கல்லூரி நிர்வாகம் / சமூக நலத்துறை',
    helpline: '14417 (கல்வி உதவி எண்)',
    checkEligibility: (p) => {
      const isFemale = p.gender === 'female' || p.gender === 'transgender';
      const isCollegeAge = p.age >= 17 && p.age <= 28;
      const studiedGovt = p.studiedGovtSchool === true;
      const inCollege = p.isEnrolledHigherEdu === true || p.occupation === 'student_higher_edu';
      return isFemale && isCollegeAge && studiedGovt && inCollege;
    },
  },
  {
    id: 'tamil_pudhalvan',
    nameTamil: 'தமிழ்ப் புதல்வன் திட்டம்',
    nameEnglish: 'Tamil Pudhalvan Scheme',
    benefitDescriptionTamil: 'அரசுப் பள்ளிகளில் படித்து உயர்கல்வி பயிலும் மாணவர்களுக்கு மாதம் ரூ. 1,000 உதவித்தொகை வழங்கப்படுகிறது.',
    category: 'education',
    amountTamil: 'ரூ. 1,000 / மாதம்',
    documentsTamil: [
      '6 முதல் 12 ஆம் வகுப்பு வரை தமிழக அரசுப் பள்ளியில் படித்த சான்றிதழ்',
      'கல்லூரி மாணவர் சேர்க்கை அடையாள அட்டை',
      'குடும்ப அட்டை மற்றும் வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'கல்லூரியில் உள்ள கல்வி உதவித்தொகை பிரிவை அணுகவும்.',
      'தமிழ்ப் புதல்வன் இணையதளத்தில் கல்லூரி மூலமாகப் பதிவேற்றம் செய்யவும்.',
    ],
    officeToContactTamil: 'கல்லூரி நிர்வாகம் / உயர் கல்வித்துறை',
    helpline: '14417 (கல்வி உதவி மையம்)',
    checkEligibility: (p) => {
      const isMale = p.gender === 'male';
      const isCollegeAge = p.age >= 17 && p.age <= 28;
      const studiedGovt = p.studiedGovtSchool === true;
      const inCollege = p.isEnrolledHigherEdu === true || p.occupation === 'student_higher_edu';
      return isMale && isCollegeAge && studiedGovt && inCollege;
    },
  },
  {
    id: 'destitute_widow_pension',
    nameTamil: 'ஆதரவற்ற விதவை ஓய்வூதியத் திட்டம் (Destitute Widow Pension)',
    nameEnglish: 'Destitute Widow Pension Scheme',
    benefitDescriptionTamil: 'ஆதரவற்ற விதவைப் பெண்களுக்கு வாழ்வாதார பாதுகாப்பாக மாதம் ரூ. 1,000 முதல் ரூ. 1,200 வரை சமூகப் பாதுகாப்பு ஓய்வூதியம் வழங்கப்படுகிறது.',
    category: 'social_security',
    amountTamil: 'ரூ. 1,000 - 1,200 / மாதம்',
    documentsTamil: [
      'கணவரின் இறப்புச் சான்றிதழ்',
      'கிராம நிர்வாக அலுவலர் (VAO) மற்றும் தாசில்தார் வழங்கும் விதவைச் சான்றிதழ்',
      'வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ரூ. 1 லட்சத்திற்குள்)',
      'ஸ்மார்ட் குடும்ப அட்டை மற்றும் வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'கிராம நிர்வாக அலுவலரிடம் (VAO) மற்றும் வருவாய் ஆய்வாளரிடம் (RI) விதவைச் சான்று பெறவும்.',
      'அருகில் உள்ள e-Seva மையம் மூலம் சமூகப் பாதுகாப்புத் திட்ட விண்ணப்பத்தை வட்டாட்சியர் (Tahsildar) அலுவலகத்திற்கு சமர்ப்பிக்கவும்.',
    ],
    officeToContactTamil: 'வட்டாட்சியர் அலுவலகம் (சமூகப் பாதுகாப்புத் திட்டம்) / e-Seva மையம்',
    helpline: '1100 (முதலமைச்சர் உதவி எண்)',
    checkEligibility: (p) => {
      if (p.gender === 'male') return false;
      const isWidow = p.maritalStatus === 'widow' || p.maritalStatus === 'destitute_widow';
      const isAdult = p.age >= 18;
      const isLowIncome = p.annualIncome === 'below_1_lakh';
      return isWidow && isAdult && isLowIncome;
    },
  },
  {
    id: 'oap',
    nameTamil: 'முதியோர் ஓய்வூதியத் திட்டம் (Old Age Pension - OAP / இந்திரா காந்தி தேசிய முதியோர் ஓய்வூதியம்)',
    nameEnglish: 'Old Age Pension Scheme (OAP)',
    benefitDescriptionTamil: '60 வயதுக்கு மேற்பட்ட ஆதரவற்ற முதியோர்களுக்கு மாதம் ரூ. 1,000 முதல் ரூ. 1,200 வரை மாதாந்திர ஓய்வூதியம் வழங்கப்படுகிறது.',
    category: 'elderly',
    amountTamil: 'ரூ. 1,000 - 1,200 / மாதம்',
    documentsTamil: [
      'வயதுச் சான்றிதழ் அல்லது வாக்காளர் அடையாள அட்டை',
      'ஸ்மார்ட் குடும்ப அட்டை',
      'கிராம நிர்வாக அலுவலர் (VAO) வழங்கும் ஆதரவற்றோர் வருமானச் சான்றிதழ்',
      'வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'கிராம நிர்வாக அலுவலரிடம் (VAO) ஆதரவற்ற முதியோர் சான்றிதழ் பெறவும்.',
      'அருகில் உள்ள e-Seva மையத்திற்குச் சென்று முதியோர் ஓய்வூதிய திட்டத்திற்கு விண்ணப்பிக்கவும்.',
    ],
    officeToContactTamil: 'தாலுகா வட்டாட்சியர் அலுவலகம் / e-Seva மையம்',
    helpline: '14567 (மூத்த குடிமக்கள் உதவி எண்) / 1100',
    checkEligibility: (p) => {
      const isElder = p.age >= 60;
      const isLowIncome = p.annualIncome === 'below_1_lakh';
      return isElder && isLowIncome;
    },
  },
  {
    id: 'cmchis',
    nameTamil: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)',
    nameEnglish: "Chief Minister's Comprehensive Health Insurance",
    benefitDescriptionTamil: 'குடும்பத்திற்கு ஆண்டுக்கு ரூ. 5 லட்சம் வரை அரசு மற்றும் தனியார் மருத்துவமனைகளில் பணமில்லா கட்டணமில்லா உயர் சிகிச்சை பெறலாம்.',
    category: 'health',
    amountTamil: 'ரூ. 5,00,000 வரை இலவச மருத்துவ சிகிச்சை / ஆண்டு',
    documentsTamil: [
      'ஸ்மார்ட் குடும்ப அட்டை (Ration Card)',
      'வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ரூ. 1.20 லட்சத்திற்குள்)',
      'குடும்ப உறுப்பினர்களின் புகைப்படம்',
    ],
    nextStepsTamil: [
      'மாவட்ட ஆட்சியர் அலுவலகம் அல்லது தாலுகா தலைமை மருத்துவமனையில் உள்ள முதலமைச்சர் காப்பீட்டு சேவை மையத்திற்குச் செல்லவும்.',
      'ஸ்மார்ட் குடும்ப அட்டையை காண்பித்து முதலமைச்சர் மருத்துவக் காப்பீட்டு அட்டை (Smart Card) உடனடியாகப் பெறவும்.',
    ],
    officeToContactTamil: 'மாவட்ட ஆட்சியர் அலுவலகம் / தாலுகா அரசு தலைமை மருத்துவமனை காப்பீட்டு மையம்',
    helpline: '1800 425 3993 (முதலமைச்சர் மருத்துவக் காப்பீட்டு இலவச அழைப்பு)',
    checkEligibility: (p) => {
      const isEligibleIncome = p.annualIncome === 'below_1_lakh' || p.annualIncome === 'below_2_5_lakh';
      return isEligibleIncome;
    },
  },
  {
    id: 'uzhavar_padhukappu',
    nameTamil: 'முதலமைச்சரின் உழவர் பாதுகாப்புத் திட்டம் (Uzhavar Padhukappu Thittam)',
    nameEnglish: "Chief Minister's Uzhavar Padhukappu Thittam",
    benefitDescriptionTamil: 'விவசாயிகள் மற்றும் விவசாயக் கூலித் தொழிலாளர்களுக்கு விபத்து நிவாரணம், ஓய்வூதியம், மகப்பேறு உதவி மற்றும் குழந்தைகள் கல்வி உதவி வழங்கப்படுகிறது.',
    category: 'agriculture',
    amountTamil: 'ரூ. 1,000 ஓய்வூதியம் & விபத்து நிவாரணம் ரூ. 1,00,000 வரை',
    documentsTamil: [
      'உழவர் பாதுகாப்பு அட்டை (Uzhavar Card) அல்லது பட்டா/சிட்டா நகல்',
      'நிலமற்ற விவசாயத் தொழிலாளர் என VAO சான்றிதழ்',
      'ஸ்மார்ட் குடும்ப அட்டை',
      'வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'கிராம நிர்வாக அலுவலரிடம் (VAO) சென்று உழவர் உறுப்பினர் சேர்க்கை சான்று பெறவும்.',
      'வட்டாட்சியர் அலுவலகத்தில் உள்ள சமூகப் பாதுகாப்பு / உழவர் பாதுகாப்பு சிறப்பு வட்டாட்சியரிடம் பதிவு செய்யவும்.',
    ],
    officeToContactTamil: 'சிறப்பு வட்டாட்சியர் (உழவர் பாதுகாப்புத் திட்டம்) / கிராம நிர்வாக அலுவலர் (VAO)',
    helpline: '1100 (அரசு உதவி மையம்)',
    checkEligibility: (p) => {
      const isFarmerOrAgri = p.occupation === 'farmer' || p.occupation === 'agricultural_labor';
      const isWorkingAge = p.age >= 18 && p.age <= 65;
      return isFarmerOrAgri && isWorkingAge;
    },
  },
  {
    id: 'differently_abled_pension',
    nameTamil: 'மாற்றுத்திறனாளிகள் மாதாந்திர பராமரிப்பு உதவித்தொகை திட்டம்',
    nameEnglish: 'Differently Abled Maintenance Allowance Scheme',
    benefitDescriptionTamil: '40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறன் கொண்ட நபர்களுக்கு மாதம் ரூ. 1,500 முதல் ரூ. 2,000 வரை நேரடி பராமரிப்பு உதவித்தொகை வழங்கப்படுகிறது.',
    category: 'differently_abled',
    amountTamil: 'ரூ. 1,500 - 2,000 / மாதம்',
    documentsTamil: [
      'மாவட்ட மருத்துவக் குழு வழங்கிய மாற்றுத்திறனாளி சான்றிதழ் (Disability Certificate)',
      'தேசிய அடையாள அட்டை (UDID Card)',
      'ஸ்மார்ட் குடும்ப அட்டை மற்றும் வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'மாவட்ட அரசு தலைமை மருத்துவமனையில் மருத்துவக் குழுவிடம் மாற்றுத்திறனாளி சான்றிதழ் பெறவும்.',
      'மாவட்ட ஆட்சியர் அலுவலகத்தில் உள்ள மாற்றுத்திறனாளிகள் நல அலுவலரிடம் (DDAWO) அல்லது e-Seva மூலம் விண்ணப்பிக்கவும்.',
    ],
    officeToContactTamil: 'மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலகம் (DDAWO) / e-Seva மையம்',
    helpline: '1800 425 0111 (மாற்றுத்திறனாளிகள் உதவி எண்)',
    checkEligibility: (p) => {
      return p.isDifferentlyAbled === true;
    },
  },
  {
    id: 'muthulakshmi_maternity',
    nameTamil: 'டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு நிதி உதவித் திட்டம்',
    nameEnglish: 'Dr. Muthulakshmi Reddy Maternity Benefit Scheme',
    benefitDescriptionTamil: 'கர்ப்பிணிப் பெண்களுக்கு ஊட்டச்சத்து மற்றும் பிரசவ கால பராமரிப்புக்காக ரூ. 18,000 மதிப்புள்ள நிதி மற்றும் ஊட்டச்சத்து பெட்டகம் வழங்கப்படுகிறது.',
    category: 'women',
    amountTamil: 'ரூ. 18,000 நிதி + அம்மா ஊட்டச்சத்து பெட்டகம்',
    documentsTamil: [
      'கிராம சுகாதார செவிலியரிடம் (VHN) பதிவு செய்யப்பட்ட PICME எண்',
      'தாய்-சேய் நல அட்டை (RCH Passbook)',
      'ஸ்மார்ட் குடும்ப அட்டை மற்றும் வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'கருவுற்ற 12 வாரங்களுக்குள் உங்கள் கிராம சுகாதார செவிலியரிடம் (VHN) அல்லது ஆரம்ப சுகாதார நிலையத்தில் (PHC) PICME பதிவு செய்யவும்.',
      'தவணை முறையில் ஆரம்ப சுகாதார நிலையம் மூலம் நிதி மற்றும் ஊட்டச்சத்து பெட்டகத்தைப் பெறவும்.',
    ],
    officeToContactTamil: 'கிராம சுகாதார செவிலியர் (VHN) / அரசு ஆரம்ப சுகாதார நிலையம் (PHC)',
    helpline: '104 (சுகாதார உதவி மையம்) / 102 (ஆம்புலன்ஸ் & தாய்-சேய் உதவி)',
    checkEligibility: (p) => {
      const isFemale = p.gender === 'female';
      const isMotherAge = p.age >= 19 && p.age <= 45;
      const isLowIncome = p.annualIncome !== 'above_2_5_lakh';
      return isFemale && isMotherAge && isLowIncome && (p.isPregnant === true);
    },
  },
  {
    id: 'marriage_assistance',
    nameTamil: 'மூவலூர் ராமாமிர்தம் அம்மையார் நினைவு திருமண நிதி உதவித் திட்டம்',
    nameEnglish: 'Moovalur Ramamirtham Marriage Assistance Scheme',
    benefitDescriptionTamil: 'ஏழைக் குடும்பத்துப் பெண்களின் திருமணத்திற்கு ரூ. 25,000 முதல் ரூ. 50,000 வரை நிதியுதவி மற்றும் 8 கிராம் தங்கம் வழங்கப்படுகிறது.',
    category: 'women',
    amountTamil: 'ரூ. 25,000 - 50,000 + 8 கிராம் (1 சவரன்) தங்கம்',
    documentsTamil: [
      'மணப்பெண்ணின் 10 ஆம் வகுப்பு அல்லது பட்டப்படிப்பு சான்றிதழ்',
      'குடும்ப வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ரூ. 72,000-க்குள்)',
      'திருமண அழைப்பிதழ்',
      'குடும்ப அட்டை மற்றும் வயதுச் சான்று (பெண் 18+, ஆண் 21+)',
    ],
    nextStepsTamil: [
      'திருமண நாளுக்கு 40 நாட்களுக்கு முன்பாக அருகில் உள்ள e-Seva மையம் மூலம் விண்ணப்பிக்கவும்.',
      'வட்டார வளர்ச்சி அலுவலகத்தில் (BDO) உள்ள சமூக நல விரிவாக்க அலுவலரிடம் சரிபார்க்கவும்.',
    ],
    officeToContactTamil: 'வட்டார வளர்ச்சி அலுவலகம் (BDO) / மாவட்ட சமூக நல அலுவலகம்',
    helpline: '181 (பெண்கள் உதவி மையம்)',
    checkEligibility: (p) => {
      if (p.gender === 'male' && !p.hasDaughterMarriageSoon) return false;
      const isLowIncome = p.annualIncome === 'below_1_lakh';
      const isApplicable = p.hasDaughterMarriageSoon === true || (p.gender === 'female' && p.age >= 18 && p.age <= 30 && p.maritalStatus === 'unmarried');
      return isLowIncome && isApplicable;
    },
  },
  {
    id: 'transgender_pension',
    nameTamil: 'தமிழ்நாடு திருநங்கைகள் மாதாந்திர ஓய்வூதியத் திட்டம்',
    nameEnglish: 'Tamil Nadu Transgender Pension Scheme',
    benefitDescriptionTamil: '40 வயதுக்கு மேற்பட்ட ஆதரவற்ற திருநங்கைகளுக்கு மாதம் ரூ. 1,000 சமூகப் பாதுகாப்பு ஓய்வூதியம் வழங்கப்படுகிறது.',
    category: 'social_security',
    amountTamil: 'ரூ. 1,000 / மாதம்',
    documentsTamil: [
      'தமிழ்நாடு திருநங்கைகள் நல வாரிய அடையாள அட்டை (Transgender ID Card)',
      'ஸ்மார்ட் குடும்ப அட்டை',
      'வருமானச் சான்றிதழ் மற்றும் வயதுச் சான்று',
      'வங்கிக் கணக்கு புத்தகம்',
    ],
    nextStepsTamil: [
      'தமிழ்நாடு திருநங்கைகள் நல வாரிய அடையாள அட்டையுடன் மாவட்ட சமூக நல அலுவலகத்தை அணுகவும்.',
      'e-Seva மையம் மூலம் சமூகப் பாதுகாப்பு ஓய்வூதியத்திற்கு விண்ணப்பிக்கவும்.',
    ],
    officeToContactTamil: 'மாவட்ட சமூக நல அலுவலகம் / வட்டாட்சியர் அலுவலகம்',
    helpline: '181 / 1100',
    checkEligibility: (p) => {
      const isTrans = p.gender === 'transgender';
      const isAge = p.age >= 40;
      const isLowIncome = p.annualIncome === 'below_1_lakh';
      return isTrans && isAge && isLowIncome;
    },
  },
];

/**
 * Pure function: Evaluate profile against all schemes
 */
export function evaluateEligibility(profile: CitizenProfile): Scheme[] {
  return TN_SCHEMES.filter((scheme) => scheme.checkEligibility(profile));
}

/**
 * Format evaluation results strictly following the user prompt template:
 *
 * 🏛️ **உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)**
 * * **[Scheme Name in Tamil]**: [1 clear sentence describing the financial or social benefit]
 *
 * 📋 **தேவையான ஆவணங்கள் (Required Documents)**
 * * [Bullet point 1]
 * * [Bullet point 2]
 * * [Bullet point 3]
 *
 * 📌 **அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)**
 * 1. [Step 1: e.g., அருகில் உள்ள e-Seva மையத்திற்குச் செல்லவும்]
 * 2. [Step 2: e.g., கிராம நிர்வாக அலுவலரிடம் (VAO) சான்றிதழ் பெறவும்]
 *
 * ⚠️ **முக்கிய குறிப்பு (Disclaimer)**
 * இது ஒரு வழிகாட்டி தகவல் மட்டுமே. இறுதி முடிவுக்கு உங்கள் உள்ளூர் VAO அலுவலகம் அல்லது e-Seva மையத்தை அணுகவும். 3. தேவைப்பட்டால் கூடுதல் ஆவணங்களைச் சரிபார்க்கவும்.
 */
export function formatEvaluationOutput(eligibleSchemes: Scheme[]): string {
  if (eligibleSchemes.length === 0) {
    return `🏛️ **உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)**
* **முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)**: குடும்பத்திற்கு ஆண்டுக்கு ரூ. 5 லட்சம் வரை பணமில்லா மருத்துவ சிகிச்சை மற்றும் அறுவை சிகிச்சை காப்பீடு.

📋 **தேவையான ஆவணங்கள் (Required Documents)**
* ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card)
* கிராம நிர்வாக அலுவலர் (VAO) அல்லது தாசில்தார் வழங்கிய குடும்ப வருமானச் சான்றிதழ்

📌 **அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)**
1. அருகில் உள்ள e-Seva மையத்திற்குச் செல்லவும்.
2. கிராம நிர்வாக அலுவலரிடம் (VAO) வருமானச் சான்றிதழ் பெறவும்.
3. மாவட்ட அரசு மருத்துவமனையில் உள்ள முதலமைச்சர் காப்பீட்டு மையத்தை அணுகவும்.

⚠️ **முக்கிய குறிப்பு (Disclaimer)**
இது ஒரு வழிகாட்டி தகவல் மட்டுமே. இறுதி முடிவுக்கு உங்கள் உள்ளூர் VAO அலுவலகம் அல்லது e-Seva மையத்தை அணுகவும். 3. தேவைப்பட்டால் கூடுதல் ஆவணங்களைச் சரிபார்க்கவும்.`;
  }

  const schemesLines = eligibleSchemes
    .map((s) => `* **${s.nameTamil}**: ${s.benefitDescriptionTamil}`)
    .join('\n');

  // Aggregate unique documents across all matched schemes
  const allDocs = Array.from(new Set(eligibleSchemes.flatMap((s) => s.documentsTamil)));
  const docsLines = allDocs.map((doc) => `* ${doc}`).join('\n');

  // Aggregate distinct next steps
  const allSteps = Array.from(new Set(eligibleSchemes.flatMap((s) => s.nextStepsTamil)));
  const stepsLines = allSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n');

  return `🏛️ **உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)**
${schemesLines}

📋 **தேவையான ஆவணங்கள் (Required Documents)**
${docsLines}

📌 **அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)**
${stepsLines}

⚠️ **முக்கிய குறிப்பு (Disclaimer)**
இது ஒரு வழிகாட்டி தகவல் மட்டுமே. இறுதி முடிவுக்கு உங்கள் உள்ளூர் VAO அலுவலகம் அல்லது e-Seva மையத்தை அணுகவும். 3. தேவைப்பட்டால் கூடுதல் ஆவணங்களைச் சரிபார்க்கவும்.`;
}
