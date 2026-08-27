import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { createReading, type ReadingMethod } from "@/lib/reading-engine";
import { setActiveReading } from "@/lib/active-reading-store";
import { stopSpeech, toggleSpeech } from "@/lib/speech";
import { drawCards, TAROT_DECK, TAROT_SPREADS, type TarotSpread } from "@/lib/tarot-spreads";
import { trpc } from "@/lib/trpc";
import type { ActiveReading, CardSelection } from "@/shared/reading";

type Stage = "home" | "intention" | "method" | "spread" | "draw-method" | "manual" | "reading";
type DrawMethod = "app" | "physical";

const intentions = ["A choice I am weighing", "A relationship", "Work and direction", "What I cannot yet name"];

function PrimaryButton({ label, onPress, icon = "arrow-forward", muted = false, disabled = false }: { label: string; onPress: () => void; icon?: keyof typeof MaterialIcons.glyphMap; muted?: boolean; disabled?: boolean }) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, muted && styles.secondaryButton, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.primaryButtonText, muted && styles.secondaryButtonText]}>{label}</Text><MaterialIcons name={icon} size={19} color={muted ? "#F5F0E6" : "#101321"} /></Pressable>;
}

function BackButton({ onPress }: { onPress: () => void }) {
  return <Pressable accessibilityLabel="Go back" onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><MaterialIcons name="arrow-back" size={20} color="#F5F0E6" /></Pressable>;
}

function ProgressHeader({ step, onBack }: { step: string; onBack: () => void }) {
  return <View style={styles.flowHeader}><BackButton onPress={onBack} /><Text style={styles.step}>{step}</Text></View>;
}

export default function PathScreen() {
  const [stage, setStage] = useState<Stage>("home");
  const [intention, setIntention] = useState("");
  const [method, setMethod] = useState<ReadingMethod>("tarot");
  const [spread, setSpread] = useState<TarotSpread>(TAROT_SPREADS[0]);
  const [drawMethod, setDrawMethod] = useState<DrawMethod>("app");
  const [manualCards, setManualCards] = useState<CardSelection[]>([]);
  const [manualIndex, setManualIndex] = useState(0);
  const [manualQuery, setManualQuery] = useState("");
  const [manualReversed, setManualReversed] = useState(false);
  const [reading, setReading] = useState<ActiveReading | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const companion = trpc.companion.reply.useMutation();
  const filteredDeck = useMemo(() => TAROT_DECK.filter((card) => card.toLowerCase().includes(manualQuery.toLowerCase())), [manualQuery]);

  const go = (next: Stage) => {
    haptic.light();
    setStage(next);
  };

  const createActiveTarotReading = async (cards: CardSelection[]) => {
    const active: ActiveReading = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      method: "tarot",
      spreadName: spread.name,
      intention: intention.trim(),
      cards,
      initialReading: "",
    };
    setIsGenerating(true);
    setStage("reading");
    try {
      const result = await companion.mutateAsync({
        reading: active,
        messages: [{ role: "user", content: "Give the integrated reading for this full spread. Speak as one continuous address with no headings or card-by-card labels. Ground it in the actual images of every card before revealing the one larger arc." }],
      });
      const completed = { ...active, initialReading: result.message };
      setReading(completed);
      await setActiveReading(completed);
      haptic.success();
    } catch {
      setReading({ ...active, initialReading: "The companion could not complete this reading just now. Your cards remain held here; try again when the connection returns." });
    } finally {
      setIsGenerating(false);
    }
  };

  const drawInApp = () => {
    const cards = drawCards(spread.positions.length).map((card, index) => ({
      position: spread.positions[index],
      card,
      reversed: Math.random() > 0.82,
    }));
    haptic.medium();
    void createActiveTarotReading(cards);
  };

  const choosePhysicalCard = (card: string) => {
    const next = [...manualCards, { position: spread.positions[manualIndex], card, reversed: manualReversed }];
    haptic.select();
    setManualCards(next);
    setManualQuery("");
    setManualReversed(false);
    if (manualIndex + 1 >= spread.positions.length) {
      void createActiveTarotReading(next);
      return;
    }
    setManualIndex((index) => index + 1);
  };

  const beginIChing = async () => {
    const generated = createReading("iching", intention);
    const active: ActiveReading = {
      id: generated.id,
      createdAt: generated.createdAt,
      method: "iching",
      spreadName: "One changing address",
      intention: intention.trim(),
      cards: [{ position: "Present address", card: generated.symbol, reversed: false }],
      initialReading: generated.reflection,
    };
    await setActiveReading(active);
    setReading(active);
    go("reading");
  };

  const listen = async () => {
    if (!reading?.initialReading) return;
    const started = await toggleSpeech(reading.initialReading, { onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });
    if (!started) setIsSpeaking(false);
  };

  const beginAgain = async () => {
    await stopSpeech();
    setIntention("");
    setSpread(TAROT_SPREADS[0]);
    setManualCards([]);
    setManualIndex(0);
    setReading(null);
    setIsSpeaking(false);
    go("home");
  };

  if (stage === "intention") {
    return <ScreenContainer className="p-5" containerClassName="bg-[#101321]"><ProgressHeader step="01 / INTENTION" onBack={() => go("home")} /><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.flowContent}><Text style={styles.flowTitle}>What are you bringing before Me?</Text><Text style={styles.flowCopy}>Write a question, tension, or hope. It stays on this device unless you choose to speak further with the companion.</Text><TextInput value={intention} onChangeText={setIntention} multiline placeholder="Write what is before you…" placeholderTextColor="#858A99" style={styles.textInput} textAlignVertical="top" /><Text style={styles.quickLabel}>OR BEGIN WITH</Text><View style={styles.chipWrap}>{intentions.map((item) => <Pressable key={item} onPress={() => { setIntention(item); haptic.select(); }} style={({ pressed }) => [styles.chip, intention === item && styles.chipActive, pressed && styles.pressed]}><Text style={[styles.chipText, intention === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</View><View style={styles.flowSpacer} /><PrimaryButton label="Choose a path" onPress={() => go("method")} /></ScrollView></ScreenContainer>;
  }

  if (stage === "method") {
    return <ScreenContainer className="p-5" containerClassName="bg-[#101321]"><ProgressHeader step="02 / LANGUAGE" onBack={() => go("intention")} /><ScrollView contentContainerStyle={styles.flowContent} showsVerticalScrollIndicator={false}><Text style={styles.flowTitle}>Choose the language of this reading.</Text><Text style={styles.flowCopy}>Tarot can unfold across a spread. I Ching begins with one present address.</Text><Pressable onPress={() => { setMethod("tarot"); haptic.select(); }} style={({ pressed }) => [styles.methodCard, method === "tarot" && styles.methodSelected, pressed && styles.pressed]}><View style={[styles.methodIcon, { backgroundColor: "#C6A86A" }]}><MaterialIcons name="auto-awesome" size={23} color="#101321" /></View><View style={styles.methodCopy}><Text style={styles.methodName}>Tarot</Text><Text style={styles.methodDescription}>Choose a spread, then draw or enter your own cards.</Text></View><MaterialIcons name={method === "tarot" ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={method === "tarot" ? "#C6A86A" : "#858A99"} /></Pressable><Pressable onPress={() => { setMethod("iching"); haptic.select(); }} style={({ pressed }) => [styles.methodCard, method === "iching" && styles.methodSelected, pressed && styles.pressed]}><View style={[styles.methodIcon, { backgroundColor: "#7D9077" }]}><MaterialIcons name="spa" size={23} color="#101321" /></View><View style={styles.methodCopy}><Text style={styles.methodName}>I Ching</Text><Text style={styles.methodDescription}>A present address and the direction of change.</Text></View><MaterialIcons name={method === "iching" ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={method === "iching" ? "#7D9077" : "#858A99"} /></Pressable><View style={styles.flowSpacer} /><PrimaryButton label="Continue" onPress={() => method === "tarot" ? go("spread") : void beginIChing()} /></ScrollView></ScreenContainer>;
  }

  if (stage === "spread") {
    return <ScreenContainer containerClassName="bg-[#101321]"><FlatList data={TAROT_SPREADS} keyExtractor={(item) => item.id} contentContainerStyle={styles.flatContent} ListHeaderComponent={<><View style={styles.flowHeader}><BackButton onPress={() => go("method")} /><Text style={styles.step}>03 / SPREAD</Text></View><Text style={styles.flowTitle}>How much of the matter needs to be seen?</Text><Text style={styles.flowCopy}>Choose the shape that fits the question. You can draw here or enter cards from your own deck.</Text></>} renderItem={({ item }) => <Pressable onPress={() => { setSpread(item); haptic.select(); go("draw-method"); }} style={({ pressed }) => [styles.spreadCard, pressed && styles.pressed]}><View style={[styles.spreadNumber, { backgroundColor: item.accent === "moss" ? "#7D9077" : item.accent === "clay" ? "#C98072" : item.accent === "ink" ? "#596174" : "#C6A86A" }]}><Text style={styles.spreadNumberText}>{item.positions.length}</Text></View><View style={styles.spreadCopy}><Text style={styles.spreadName}>{item.name}</Text><Text style={styles.spreadDescription}>{item.description}</Text><Text style={styles.spreadPositions}>{item.positions.join(" · ")}</Text></View><MaterialIcons name="chevron-right" size={22} color="#9FA5B4" /></Pressable>} /></ScreenContainer>;
  }

  if (stage === "draw-method") {
    return <ScreenContainer className="p-5" containerClassName="bg-[#101321]"><ProgressHeader step="04 / CARDS" onBack={() => go("spread")} /><ScrollView contentContainerStyle={styles.flowContent} showsVerticalScrollIndicator={false}><Text style={styles.flowTitle}>{spread.name}</Text><Text style={styles.flowCopy}>{spread.positions.length} positions: {spread.positions.join(" · ")}</Text><Pressable onPress={() => { setDrawMethod("app"); haptic.select(); }} style={({ pressed }) => [styles.methodCard, drawMethod === "app" && styles.methodSelected, pressed && styles.pressed]}><View style={[styles.methodIcon, { backgroundColor: "#C6A86A" }]}><MaterialIcons name="shuffle" size={23} color="#101321" /></View><View style={styles.methodCopy}><Text style={styles.methodName}>Draw in Numinous Path</Text><Text style={styles.methodDescription}>Let the app select each card for this spread.</Text></View><MaterialIcons name={drawMethod === "app" ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={drawMethod === "app" ? "#C6A86A" : "#858A99"} /></Pressable><Pressable onPress={() => { setDrawMethod("physical"); haptic.select(); }} style={({ pressed }) => [styles.methodCard, drawMethod === "physical" && styles.methodSelected, pressed && styles.pressed]}><View style={[styles.methodIcon, { backgroundColor: "#7D9077" }]}><MaterialIcons name="style" size={23} color="#101321" /></View><View style={styles.methodCopy}><Text style={styles.methodName}>I have my own cards</Text><Text style={styles.methodDescription}>Choose what you pulled from your physical deck, including reversals.</Text></View><MaterialIcons name={drawMethod === "physical" ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={drawMethod === "physical" ? "#7D9077" : "#858A99"} /></Pressable><View style={styles.flowSpacer} /><PrimaryButton label={drawMethod === "app" ? "Draw the spread" : "Enter my cards"} onPress={() => { if (drawMethod === "app") drawInApp(); else { setManualCards([]); setManualIndex(0); go("manual"); } }} icon={drawMethod === "app" ? "shuffle" : "style"} /></ScrollView></ScreenContainer>;
  }

  if (stage === "manual") {
    const position = spread.positions[manualIndex];
    return <ScreenContainer containerClassName="bg-[#101321]"><FlatList data={filteredDeck} keyExtractor={(item) => item} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.flatContent} ListHeaderComponent={<><View style={styles.flowHeader}><BackButton onPress={() => go("draw-method")} /><Text style={styles.step}>CARD {manualIndex + 1} OF {spread.positions.length}</Text></View><Text style={styles.flowTitle}>{position}</Text><Text style={styles.flowCopy}>Name the card you pulled. It will remain tied to this position in the reading.</Text><TextInput value={manualQuery} onChangeText={setManualQuery} placeholder="Search the Tarot deck…" placeholderTextColor="#858A99" style={styles.searchInput} /><View style={styles.reversedRow}><View><Text style={styles.reversedTitle}>Reversed card</Text><Text style={styles.reversedCopy}>Turn the image inward rather than treating it as bad news.</Text></View><Switch value={manualReversed} onValueChange={(value) => { setManualReversed(value); haptic.select(); }} trackColor={{ false: "#3E4658", true: "#C6A86A" }} thumbColor="#F5F0E6" /></View><Text style={styles.deckLabel}>ALL CARDS</Text></>} renderItem={({ item }) => <Pressable onPress={() => choosePhysicalCard(item)} style={({ pressed }) => [styles.deckCard, pressed && styles.pressed]}><Text style={styles.deckCardName}>{item}</Text><MaterialIcons name="add" size={20} color="#C6A86A" /></Pressable>} ListEmptyComponent={<Text style={styles.emptySearch}>No card matches that search.</Text>} /></ScreenContainer>;
  }

  if (stage === "reading") {
    return <ScreenContainer className="p-5" containerClassName="bg-[#101321]"><ProgressHeader step="YOUR READING" onBack={() => void beginAgain()} /><ScrollView contentContainerStyle={styles.readingContent} showsVerticalScrollIndicator={false}>{isGenerating ? <View style={styles.loadingReading}><ActivityIndicator color="#C6A86A" size="large" /><Text style={styles.loadingTitle}>The companion is reading the whole spread.</Text><Text style={styles.loadingCopy}>It is holding each image together before speaking.</Text></View> : reading ? <><View style={styles.readingSpreadHeader}><Text style={styles.symbolMethod}>{reading.spreadName.toUpperCase()}</Text><Text style={styles.readingCount}>{reading.cards.length} {reading.cards.length === 1 ? "CARD" : "CARDS"}</Text></View><View style={styles.cardStack}>{reading.cards.map((card) => <View key={`${card.position}-${card.card}`} style={styles.readingCard}><Text style={styles.positionName}>{card.position}</Text><Text style={styles.cardName}>{card.card}{card.reversed ? " · Reversed" : ""}</Text></View>)}</View><View style={styles.audioRow}><Pressable onPress={() => void listen()} style={({ pressed }) => [styles.listenButton, pressed && styles.pressed]}><MaterialIcons name={isSpeaking ? "stop" : "volume-up"} size={20} color="#101321" /><Text style={styles.listenText}>{isSpeaking ? "Stop listening" : "Listen"}</Text></Pressable><Text style={styles.audioHint}>Uses your device voice</Text></View><Text style={styles.readingKicker}>AN ADDRESS FOR THIS MOMENT</Text><Text style={styles.reflection}>{reading.initialReading}</Text><Pressable onPress={() => router.push("/(tabs)/companion")} style={({ pressed }) => [styles.companionButton, pressed && styles.pressed]}><View style={styles.companionIcon}><MaterialIcons name="chat-bubble" size={20} color="#C6A86A" /></View><View style={styles.companionCopy}><Text style={styles.companionTitle}>Continue with the companion</Text><Text style={styles.companionSub}>Ask about a card, a position, or what the spread is asking of you.</Text></View><MaterialIcons name="chevron-right" size={22} color="#AEB3C0" /></Pressable><PrimaryButton label="Begin another reading" onPress={() => void beginAgain()} icon="refresh" muted /></> : null}</ScrollView></ScreenContainer>;
  }

  return <ScreenContainer className="p-5" containerClassName="bg-[#101321]"><ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}><View style={styles.homeTopline}><Text style={styles.brand}>NUMINOUS PATH</Text><View style={styles.privatePill}><MaterialIcons name="lock-outline" size={13} color="#C6A86A" /><Text style={styles.privatePillText}>PRIVATE</Text></View></View><View style={styles.homeHero}><View style={styles.homeMark}><View style={styles.markGlow} /><MaterialIcons name="nightlight-round" size={42} color="#F5F0E6" /></View><Text style={styles.homeTitle}>Make room for what is asking to be heard.</Text><Text style={styles.homeSubtitle}>Choose a spread, draw here or enter your own cards, then keep the conversation open.</Text></View><View style={styles.homeNote}><MaterialIcons name="info-outline" size={19} color="#7D9077" /><Text style={styles.homeNoteText}>A reading offers reflection, not a verdict. Your life remains your own.</Text></View><View style={styles.homeSpacer} /><PrimaryButton label="Begin a reading" onPress={() => go("intention")} /><Text style={styles.homeFooter}>TAROT · I CHING · COMPANION · LOCAL JOURNAL</Text></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  homeContent: { flexGrow: 1, paddingBottom: 22 },
  homeTopline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  brand: { color: "#F5F0E6", fontSize: 12, fontWeight: "800", letterSpacing: 2.2 },
  privatePill: { flexDirection: "row", gap: 5, alignItems: "center", borderWidth: 1, borderColor: "#2F3445", borderRadius: 99, paddingHorizontal: 9, paddingVertical: 5 },
  privatePillText: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  homeHero: { alignItems: "center", marginTop: 52, paddingHorizontal: 14 },
  homeMark: { height: 106, width: 106, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#4D4534", borderRadius: 53, marginBottom: 31, overflow: "hidden" },
  markGlow: { position: "absolute", height: 76, width: 76, borderRadius: 38, backgroundColor: "#C6A86A", opacity: 0.16 },
  homeTitle: { color: "#F5F0E6", fontSize: 35, lineHeight: 42, fontWeight: "700", letterSpacing: -1.1, textAlign: "center" },
  homeSubtitle: { color: "#B0B4C1", fontSize: 16, lineHeight: 24, textAlign: "center", marginTop: 17, maxWidth: 320 },
  homeNote: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#171B2B", borderWidth: 1, borderColor: "#262B3D", borderRadius: 18, padding: 16, marginTop: 42 },
  homeNoteText: { flex: 1, color: "#B8BCC7", fontSize: 13, lineHeight: 19 },
  homeSpacer: { flex: 1, minHeight: 56 },
  homeFooter: { color: "#73798A", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, textAlign: "center", marginTop: 20 },
  primaryButton: { minHeight: 56, borderRadius: 18, backgroundColor: "#C6A86A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 20 },
  secondaryButton: { backgroundColor: "#22283A", borderWidth: 1, borderColor: "#333A4E", marginTop: 12 },
  primaryButtonText: { color: "#101321", fontSize: 16, fontWeight: "800" },
  secondaryButtonText: { color: "#F5F0E6" },
  flowHeader: { flexDirection: "row", alignItems: "center", gap: 13, minHeight: 41 },
  backButton: { height: 40, width: 40, borderRadius: 20, borderWidth: 1, borderColor: "#343A4F", alignItems: "center", justifyContent: "center" },
  step: { color: "#A3A8B6", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  flowContent: { flexGrow: 1, paddingTop: 39, paddingBottom: 18 },
  flatContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 11 },
  flowTitle: { color: "#F5F0E6", fontSize: 31, lineHeight: 38, fontWeight: "700", letterSpacing: -0.8, marginTop: 20 },
  flowCopy: { color: "#AEB3C0", fontSize: 15, lineHeight: 23, marginTop: 13, marginBottom: 7 },
  textInput: { minHeight: 142, color: "#F5F0E6", fontSize: 17, lineHeight: 25, backgroundColor: "#171B2B", borderWidth: 1, borderColor: "#30364A", borderRadius: 18, padding: 16, marginTop: 28 },
  quickLabel: { color: "#7F8596", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginTop: 25, marginBottom: 12 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: { paddingHorizontal: 13, paddingVertical: 10, borderWidth: 1, borderColor: "#343A4F", borderRadius: 99 },
  chipActive: { backgroundColor: "#F5F0E6", borderColor: "#F5F0E6" },
  chipText: { color: "#C7CBD5", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#101321" },
  flowSpacer: { flex: 1, minHeight: 32 },
  methodCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#171B2B", borderRadius: 20, borderWidth: 1, borderColor: "#30364A", padding: 16, marginTop: 22 },
  methodSelected: { borderColor: "#C6A86A" },
  methodIcon: { height: 48, width: 48, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  methodCopy: { flex: 1 },
  methodName: { color: "#F5F0E6", fontSize: 17, fontWeight: "800" },
  methodDescription: { color: "#AEB3C0", fontSize: 13, lineHeight: 18, marginTop: 3 },
  spreadCard: { flexDirection: "row", gap: 13, backgroundColor: "#171B2B", borderRadius: 20, borderWidth: 1, borderColor: "#30364A", padding: 15, alignItems: "center" },
  spreadNumber: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  spreadNumberText: { color: "#101321", fontWeight: "900", fontSize: 16 },
  spreadCopy: { flex: 1 },
  spreadName: { color: "#F5F0E6", fontSize: 16, fontWeight: "800" },
  spreadDescription: { color: "#B0B5C1", fontSize: 13, lineHeight: 18, marginTop: 3 },
  spreadPositions: { color: "#7F8798", fontSize: 10, lineHeight: 15, fontWeight: "700", letterSpacing: 0.4, marginTop: 6 },
  searchInput: { minHeight: 51, borderRadius: 16, backgroundColor: "#171B2B", borderWidth: 1, borderColor: "#30364A", color: "#F5F0E6", paddingHorizontal: 15, fontSize: 15, marginTop: 23 },
  reversedRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#171B2B", borderWidth: 1, borderColor: "#30364A", borderRadius: 16, padding: 14, marginTop: 12 },
  reversedTitle: { color: "#F5F0E6", fontSize: 14, fontWeight: "800" },
  reversedCopy: { color: "#AEB3C0", fontSize: 12, lineHeight: 17, maxWidth: 245, marginTop: 3 },
  deckLabel: { color: "#7E8595", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginTop: 25, marginBottom: 4 },
  deckCard: { minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#262D40", paddingHorizontal: 3 },
  deckCardName: { color: "#E7E2D8", fontSize: 15, fontWeight: "700" },
  emptySearch: { color: "#AEB3C0", fontSize: 14, textAlign: "center", marginTop: 25 },
  readingContent: { paddingTop: 24, paddingBottom: 26 },
  loadingReading: { minHeight: 410, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  loadingTitle: { color: "#F5F0E6", fontSize: 20, fontWeight: "800", textAlign: "center", marginTop: 20 },
  loadingCopy: { color: "#AEB3C0", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 },
  readingSpreadHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  symbolMethod: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  readingCount: { color: "#8990A0", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  cardStack: { marginTop: 13, gap: 8 },
  readingCard: { padding: 14, backgroundColor: "#171B2B", borderRadius: 15, borderWidth: 1, borderColor: "#2B3245" },
  positionName: { color: "#8890A0", fontSize: 10, fontWeight: "800", letterSpacing: 1.3 },
  cardName: { color: "#F5F0E6", fontSize: 16, fontWeight: "800", marginTop: 4 },
  audioRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 21 },
  listenButton: { minHeight: 43, backgroundColor: "#C6A86A", borderRadius: 14, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 8 },
  listenText: { color: "#101321", fontSize: 14, fontWeight: "900" },
  audioHint: { color: "#858C9D", fontSize: 12 },
  readingKicker: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginTop: 29 },
  reflection: { color: "#E1DDD3", fontSize: 17, lineHeight: 29, marginTop: 14 },
  companionButton: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 19, padding: 15, borderWidth: 1, borderColor: "#394052", backgroundColor: "#1A2030", marginTop: 28 },
  companionIcon: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#252C3E" },
  companionCopy: { flex: 1 },
  companionTitle: { color: "#F5F0E6", fontSize: 15, fontWeight: "800" },
  companionSub: { color: "#ABB1BF", fontSize: 12, lineHeight: 18, marginTop: 3 },
});
