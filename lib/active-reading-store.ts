import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ActiveReading, CompanionMessage } from "@/shared/reading";

const ACTIVE_READING_KEY = "@numinous-path/active-reading";
const CONVERSATION_KEY = "@numinous-path/active-conversation";

export async function getActiveReading(): Promise<ActiveReading | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_READING_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ActiveReading;
  } catch {
    return null;
  }
}

export async function setActiveReading(reading: ActiveReading) {
  await AsyncStorage.setItem(ACTIVE_READING_KEY, JSON.stringify(reading));
  const initialMessage: CompanionMessage = {
    id: `${reading.id}-initial`,
    role: "assistant",
    content: reading.initialReading,
    createdAt: reading.createdAt,
  };
  await AsyncStorage.setItem(CONVERSATION_KEY, JSON.stringify([initialMessage]));
}

export async function getConversation(): Promise<CompanionMessage[]> {
  const raw = await AsyncStorage.getItem(CONVERSATION_KEY);
  if (!raw) return [];

  try {
    const messages = JSON.parse(raw) as CompanionMessage[];
    // Legacy builds stored transient provider errors as if the AI had answered.
    // Keep real questions/readings, but do not replay those errors as divination.
    return Array.isArray(messages) ? messages.filter(message => !(
      message.role === "assistant" && (
        message.id.startsWith("assistant-error-") ||
        message.content === "The companion could not answer just now. The reading remains here; try again when the connection returns."
      )
    )) : [];
  } catch {
    return [];
  }
}

export async function setConversation(messages: CompanionMessage[]) {
  await AsyncStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
}
