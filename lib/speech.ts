import * as Speech from "expo-speech";

type SpeechCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
};

export async function toggleSpeech(text: string, callbacks: SpeechCallbacks = {}) {
  const isSpeaking = await Speech.isSpeakingAsync();
  if (isSpeaking) {
    await Speech.stop();
    callbacks.onEnd?.();
    return false;
  }

  Speech.speak(text, {
    language: "en-US",
    pitch: 0.94,
    rate: 0.9,
    onStart: callbacks.onStart,
    onDone: callbacks.onEnd,
    onStopped: callbacks.onEnd,
    onError: callbacks.onEnd,
  });
  return true;
}

export async function stopSpeech() {
  await Speech.stop();
}
