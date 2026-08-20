import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Reading } from "@/lib/reading-engine";

const READING_KEY = "@numinous-path/readings";

export async function getReadings(): Promise<Reading[]> {
  const raw = await AsyncStorage.getItem(READING_KEY);
  if (!raw) return [];

  try {
    const entries = JSON.parse(raw) as Reading[];
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export async function saveReading(reading: Reading) {
  const current = await getReadings();
  await AsyncStorage.setItem(READING_KEY, JSON.stringify([reading, ...current]));
}

export async function clearReadings() {
  await AsyncStorage.removeItem(READING_KEY);
}
