import { recoClient } from './apiClient'

export type ProfileDto = {
  age: number; height_cm: number; weight_kg: number;
  gender: 'female'|'male'|'other';
  activity: 'low'|'medium'|'high';
  goal: 'lose_weight'|'stay_fit'|'gain_muscle';
}

export async function getPersonalizedRecs(profile: ProfileDto) {
  return recoClient.post<Array<{
    id: string; title: string; description: string;
    freq_per_week: number; duration_min: number; intensity: string;
  }>>('/reco/personalized', profile)
}
