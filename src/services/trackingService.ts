// src/services/trackingService.ts
import { recoClient } from './apiClient'

export type Measurement = {
  date: string
  weight_kg?: number
  waist_cm?: number
  hips_cm?: number
  chest_cm?: number
  notes?: string
}

export async function getMeasurements(email: string) {
  return recoClient.get<Measurement[]>(
    `/tracking/measurements?email=${encodeURIComponent(email)}`
  )
}

export async function addMeasurement(email: string, m: Measurement) {
  return recoClient.post<{ ok: boolean; id: number }>(
    `/tracking/measurements?email=${encodeURIComponent(email)}`,
    m
  )
}
