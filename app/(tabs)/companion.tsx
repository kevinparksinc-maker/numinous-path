import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenContainer } from "@/components/screen-container";
import { getActiveReading, getConversation, setConversation } from "@/lib/active-reading-store";
import { haptic } from "@/lib/haptics";
import { toggleSpeech } from "@/lib/speech";
import { trpc } from "@/lib/trpc";
import type { ActiveReading, CompanionMessage } from "@/shared/reading";

export default function CompanionScreen() {
  const [reading, setReading] = useState<ActiveReading | null>(null);
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const companion = trpc.companion.reply.useMutation();

  const refresh = useCallback(() => {
    Promise.all([getActiveReading(), getConversation()]).then(([active, conversation]) => {
      setReading(active);
      setMessages(conversation);
      setLoading(false);
    });
  }, []);

  useFocusEffect(refresh);

  const send = async () => {
    const prompt = draft.trim();
    if (!prompt || !reading || sending) return;
    const userMessage: CompanionMessage = { id: `user-${Date.now()}`, role: "user", content: prompt, createdAt: new Date().toISOString() };
    const next = [...messages, userMessage];
    setMessages(next);
    setDraft("");
    setSending(true);
    haptic.light();
    try {
      const result = await companion.mutateAsync({ reading, messages: next.map(({ role, content }) => ({ role, content })) });
      const assistantMessage: CompanionMessage = { id: `assistant-${Date.now()}`, role: "assistant", content: result.message, createdAt: new Date().toISOString() };
      const completed = [...next, assistantMessage];
      setMessages(completed);
      await setConversation(completed);
      haptic.success();
    } catch {
      const failed: CompanionMessage = { id: `assistant-error-${Date.now()}`, role: "assistant", content: "The companion could not answer just now. The reading remains here; try again when the connection returns.", createdAt: new Date().toISOString() };
      const completed = [...next, failed];
      setMessages(completed);
      await setConversation(completed);
    } finally {
      setSending(false);
    }
  };

  const speak = async (message: CompanionMessage) => {
    if (message.role !== "assistant") return;
    const started = await toggleSpeech(message.content, { onStart: () => setSpeakingId(message.id), onEnd: () => setSpeakingId(null) });
    if (!started) setSpeakingId(null);
  };

  if (loading) return <ScreenContainer containerClassName="bg-[#101321]"><View style={styles.center}><ActivityIndicator color="#C6A86A" /></View></ScreenContainer>;

  if (!reading) return <ScreenContainer className="p-5" containerClassName="bg-[#101321]"><View style={styles.empty}><View style={styles.emptyIcon}><MaterialIcons name="chat-bubble-outline" size={29} color="#C6A86A" /></View><Text style={styles.emptyTitle}>The companion begins with a reading.</Text><Text style={styles.emptyCopy}>Choose a Tarot spread or an I Ching address first. Then return here to ask about any card, position, or question that remains open.</Text><Pressable onPress={() => router.push("/")} style={({ pressed }) => [styles.begin, pressed && styles.pressed]}><Text style={styles.beginText}>Begin a reading</Text><MaterialIcons name="arrow-forward" size={18} color="#101321" /></Pressable></View></ScreenContainer>;

  return <ScreenContainer containerClassName="bg-[#101321]"><KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}><FlatList data={messages} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled" renderItem={({ item }) => <View style={[styles.messageRow, item.role === "user" && styles.userRow]}><View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.assistantBubble]}><Text style={[styles.messageText, item.role === "user" ? styles.userText : styles.assistantText]}>{item.content}</Text>{item.role === "assistant" && <Pressable onPress={() => void speak(item)} style={({ pressed }) => [styles.speak, pressed && styles.pressed]}><MaterialIcons name={speakingId === item.id ? "stop" : "volume-up"} size={16} color="#C6A86A" /><Text style={styles.speakText}>{speakingId === item.id ? "Stop" : "Listen"}</Text></Pressable>}</View></View>} ListHeaderComponent={<View style={styles.header}><Text style={styles.eyebrow}>ACTIVE READING</Text><Text style={styles.title}>Companion</Text><Text style={styles.cards}>{reading.spreadName} · {reading.cards.map((card) => card.card).join(" · ")}</Text><Text style={styles.intention}>{reading.intention ? `“${reading.intention}”` : "Ask what remains open in the reading."}</Text></View>} ListFooterComponent={sending ? <View style={styles.typing}><ActivityIndicator size="small" color="#C6A86A" /><Text style={styles.typingText}>The companion is considering the cards…</Text></View> : null} /><View style={styles.composer}><TextInput value={draft} onChangeText={setDraft} placeholder="Ask about this reading…" placeholderTextColor="#7F8797" style={styles.composerInput} multiline returnKeyType="send" onSubmitEditing={() => void send()} /><Pressable disabled={!draft.trim() || sending} onPress={() => void send()} style={({ pressed }) => [styles.send, (!draft.trim() || sending) && styles.sendDisabled, pressed && styles.pressed]}><MaterialIcons name="arrow-upward" size={20} color="#101321" /></Pressable></View></KeyboardAvoidingView></ScreenContainer>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingHorizontal: 17, paddingTop: 24, paddingBottom: 18 },
  header: { paddingHorizontal: 4, paddingBottom: 25 },
  eyebrow: { color: "#C6A86A", fontSize: 10, letterSpacing: 1.6, fontWeight: "800" },
  title: { color: "#F5F0E6", fontSize: 32, letterSpacing: -0.8, fontWeight: "800", marginTop: 7 },
  cards: { color: "#C6C9D1", fontSize: 13, lineHeight: 20, marginTop: 9 },
  intention: { color: "#8F96A6", fontSize: 13, lineHeight: 20, fontStyle: "italic", marginTop: 6 },
  messageRow: { alignItems: "flex-start", marginBottom: 12 },
  userRow: { alignItems: "flex-end" },
  bubble: { maxWidth: "89%", borderRadius: 19, paddingHorizontal: 15, paddingVertical: 13 },
  assistantBubble: { backgroundColor: "#1B2131", borderWidth: 1, borderColor: "#30374A", borderBottomLeftRadius: 5 },
  userBubble: { backgroundColor: "#C6A86A", borderBottomRightRadius: 5 },
  messageText: { fontSize: 15, lineHeight: 22 },
  assistantText: { color: "#E5E1D8" },
  userText: { color: "#101321", fontWeight: "600" },
  speak: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 11, alignSelf: "flex-start" },
  speakText: { color: "#C6A86A", fontSize: 12, fontWeight: "800" },
  typing: { flexDirection: "row", gap: 8, alignItems: "center", paddingVertical: 13, paddingHorizontal: 13 },
  typingText: { color: "#AAB0BF", fontSize: 13 },
  composer: { flexDirection: "row", gap: 10, alignItems: "flex-end", padding: 13, borderTopWidth: 1, borderTopColor: "#252D40", backgroundColor: "#101321" },
  composerInput: { flex: 1, minHeight: 48, maxHeight: 120, backgroundColor: "#1A2030", borderRadius: 16, borderWidth: 1, borderColor: "#323A4E", color: "#F5F0E6", fontSize: 15, lineHeight: 21, paddingHorizontal: 14, paddingVertical: 12 },
  send: { height: 48, width: 48, borderRadius: 16, backgroundColor: "#C6A86A", alignItems: "center", justifyContent: "center" },
  sendDisabled: { opacity: 0.4 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 34, paddingBottom: 80 },
  emptyIcon: { height: 67, width: 67, borderRadius: 34, backgroundColor: "#1B2131", borderWidth: 1, borderColor: "#343C50", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { color: "#F5F0E6", fontSize: 23, lineHeight: 30, fontWeight: "800", textAlign: "center" },
  emptyCopy: { color: "#ABB1BF", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 9 },
  begin: { minHeight: 52, borderRadius: 17, backgroundColor: "#C6A86A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 18, marginTop: 25 },
  beginText: { color: "#101321", fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
