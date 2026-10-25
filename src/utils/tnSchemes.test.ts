/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEligibility, formatEvaluationOutput, CitizenProfile } from './tnSchemes.ts';

test('Kalaignar Magalir Urimai Thittam eligibility for adult low-income woman', () => {
  const profile: CitizenProfile = {
    age: 35,
    gender: 'female',
    maritalStatus: 'married',
    annualIncome: 'below_2_5_lakh',
  };

  const schemes = evaluateEligibility(profile);
  const kmuy = schemes.find((s) => s.id === 'kmuy');
  assert.ok(kmuy, 'Should be eligible for Kalaignar Magalir Urimai Thittam');
  assert.equal(kmuy?.nameTamil, 'கலைஞர் மகளிர் உரிமைத் திட்டம்');
});

test('Destitute Widow Pension for low-income widow', () => {
  const profile: CitizenProfile = {
    age: 48,
    gender: 'female',
    maritalStatus: 'destitute_widow',
    annualIncome: 'below_1_lakh',
  };

  const schemes = evaluateEligibility(profile);
  const widowScheme = schemes.find((s) => s.id === 'destitute_widow_pension');
  assert.ok(widowScheme, 'Should be eligible for Destitute Widow Pension');
  assert.equal(widowScheme?.id, 'destitute_widow_pension');
});

test('Old Age Pension (OAP) for low-income senior citizen aged 65', () => {
  const profile: CitizenProfile = {
    age: 65,
    gender: 'male',
    annualIncome: 'below_1_lakh',
  };

  const schemes = evaluateEligibility(profile);
  const oap = schemes.find((s) => s.id === 'oap');
  assert.ok(oap, 'Senior citizen should be eligible for OAP');
});

test('Pudhumai Penn scheme for girl student from govt school entering college', () => {
  const profile: CitizenProfile = {
    age: 19,
    gender: 'female',
    annualIncome: 'below_2_5_lakh',
    studiedGovtSchool: true,
    isEnrolledHigherEdu: true,
    occupation: 'student_higher_edu',
  };

  const schemes = evaluateEligibility(profile);
  const pudhumaiPenn = schemes.find((s) => s.id === 'pudhumai_penn');
  assert.ok(pudhumaiPenn, 'Govt school girl in college should get Pudhumai Penn');
});

test('Tamil Pudhalvan scheme for boy student from govt school in college', () => {
  const profile: CitizenProfile = {
    age: 19,
    gender: 'male',
    annualIncome: 'below_2_5_lakh',
    studiedGovtSchool: true,
    isEnrolledHigherEdu: true,
    occupation: 'student_higher_edu',
  };

  const schemes = evaluateEligibility(profile);
  const tamilPudhalvan = schemes.find((s) => s.id === 'tamil_pudhalvan');
  assert.ok(tamilPudhalvan, 'Govt school boy in college should get Tamil Pudhalvan');
});

test('Uzhavar Padhukappu Thittam for farmer aged 40', () => {
  const profile: CitizenProfile = {
    age: 40,
    gender: 'male',
    annualIncome: 'below_1_lakh',
    occupation: 'farmer',
  };

  const schemes = evaluateEligibility(profile);
  const farmerScheme = schemes.find((s) => s.id === 'uzhavar_padhukappu');
  assert.ok(farmerScheme, 'Farmer should be eligible for Uzhavar Padhukappu');
});

test('Differently Abled Maintenance Allowance', () => {
  const profile: CitizenProfile = {
    age: 28,
    gender: 'female',
    annualIncome: 'below_1_lakh',
    isDifferentlyAbled: true,
  };

  const schemes = evaluateEligibility(profile);
  const daScheme = schemes.find((s) => s.id === 'differently_abled_pension');
  assert.ok(daScheme, 'Should match Differently Abled Maintenance Allowance');
});

test('FormatEvaluationOutput follows prompt markdown template strictly', () => {
  const profile: CitizenProfile = {
    age: 62,
    gender: 'female',
    maritalStatus: 'widow',
    annualIncome: 'below_1_lakh',
  };

  const schemes = evaluateEligibility(profile);
  const formatted = formatEvaluationOutput(schemes);

  // Check required headings
  assert.ok(formatted.includes('🏛️ **உங்களுக்கு உகந்த அரசு நலத்திட்டங்கள் (Eligible Schemes)**'));
  assert.ok(formatted.includes('📋 **தேவையான ஆவணங்கள் (Required Documents)**'));
  assert.ok(formatted.includes('📌 **அடுத்து நீங்கள் செய்ய வேண்டிய எளிய நடவடிக்கை (Next Steps)**'));
  assert.ok(formatted.includes('⚠️ **முக்கிய குறிப்பு (Disclaimer)**'));
  assert.ok(formatted.includes('இது ஒரு வழிகாட்டி தகவல் மட்டுமே.'));
});

test('When gender is male (ஆண்), female-only schemes are strictly filtered out and male-eligible schemes are returned', () => {
  const maleFarmer: CitizenProfile = {
    age: 45,
    gender: 'male',
    annualIncome: 'below_1_lakh',
    occupation: 'farmer',
    isDifferentlyAbled: true,
  };

  const schemes = evaluateEligibility(maleFarmer);
  const ids = schemes.map((s) => s.id);

  // Strictly excluded female-only schemes
  assert.ok(!ids.includes('kmuy'), 'Kalaignar Magalir Urimai Thittam must NOT be eligible for male');
  assert.ok(!ids.includes('pudhumai_penn'), 'Pudhumai Penn must NOT be eligible for male');
  assert.ok(!ids.includes('destitute_widow_pension'), 'Widow pension must NOT be eligible for male');
  assert.ok(!ids.includes('muthulakshmi_maternity'), 'Maternity assistance must NOT be eligible for male');

  // Included male-eligible schemes
  assert.ok(ids.includes('uzhavar_padhukappu'), 'Uzhavar Padhukappu Thittam must be eligible for male farmer');
  assert.ok(ids.includes('cmchis'), 'CMCHIS must be eligible for male low-income citizen');
  assert.ok(ids.includes('differently_abled_pension'), 'Differently abled pension must be eligible for male');
});

test('Transgender pension for transgender citizen aged 45', () => {
  const transProfile: CitizenProfile = {
    age: 45,
    gender: 'transgender',
    annualIncome: 'below_1_lakh',
  };

  const schemes = evaluateEligibility(transProfile);
  const transScheme = schemes.find((s) => s.id === 'transgender_pension');
  assert.ok(transScheme, 'Transgender citizen should be eligible for transgender pension');
});

