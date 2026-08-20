import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { createReading, type Reading, type ReadingMethod } from "@/lib/reading-engine";
import { saveReading } from "@/lib/reading-store";

type Stage = "home" | "intention" | "method" | "draw" | "reading";

const intentions = ["A choice I am weighing", "A relationship", "Work and direction", "What I cannot yet name"];

const accentFor = (accent: Reading["accent"]) => accent === "moss" ? "#7D9077" : accent === "clay" ? "#C98072" : "#C6A86A";

function PrimaryButton({ label, onPress, icon = "arrow-forward", muted = false }: { label: string; onPress: () => void; icon?: keyof typeof MaterialIcons.glyphMap; muted?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, muted && styles.secondaryButton, pressed && styles.pressed]}>
      <Text style={[styles.primaryButtonText, muted && styles.secondaryButtonText]}>{label}</Text>
      <MaterialIcons name={icon} size={19} color={muted ? "#F5F0E6" : "#101321"} />
    </Pressable>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityLabel="Go back" onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
      <MaterialIcons name="arrow-back" size={20} color="#F5F0E6" />
    </Pressable>
  );
}

export default function HomeScreen() {
  const [stage, setStage] = useState<Stage>("home");
  const [intention, setIntention] = useState("");
  const [method, setMethod] = useState<ReadingMethod>("tarot");
  const [reading, setReading] = useState<Reading | null>(null);
  const [saved, setSaved] = useState(false);

  const go = (next: Stage) => {
    haptic.light();
    setStage(next);
  };

  const draw = () => {
    haptic.medium();
    const next = createReading(method, intention);
    setReading(next);
    setSaved(false);
    setStage("reading");
    haptic.success();
  };

  const storeCurrentReading = async () => {
    if (!reading || saved) return;
    await saveReading(reading);
    setSaved(true);
    haptic.success();
  };

  const beginAgain = () => {
    setIntention("");
    setMethod("tarot");
    setReading(null);
    setSaved(false);
    go("home");
  };

  if (stage === "intention") {
    return (
      <ScreenContainer className="p-5" containerClassName="bg-[#101321]">
        <View style={styles.flowHeader}><BackButton onPress={() => go("home")} /><Text style={styles.step}>01 / INTENTION</Text></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.flowContent}>
          <Text style={styles.flowTitle}>What are you carrying into this moment?</Text>
          <Text style={styles.flowCopy}>A few honest words are enough. This stays on your device.</Text>
          <TextInput value={intention} onChangeText={setIntention} multiline placeholder="Write a question, a tension, or a hope…" placeholderTextColor="#858A99" style={styles.textInput} textAlignVertical="top" />
          <Text style={styles.quickLabel}>OR BEGIN WITH</Text>
          <View style={styles.chipWrap}>
            {intentions.map((item) => <Pressable key={item} onPress={() => { setIntention(item); haptic.select(); }} style={({ pressed }) => [styles.chip, intention === item && styles.chipActive, pressed && styles.pressed]}><Text style={[styles.chipText, intention === item && styles.chipTextActive]}>{item}</Text></Pressable>)}
          </View>
          <View style={styles.flowSpacer} />
          <PrimaryButton label="Choose a path" onPress={() => go("method")} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (stage === "method") {
    return (
      <ScreenContainer className="p-5" containerClassName="bg-[#101321]">
        <View style={styles.flowHeader}><BackButton onPress={() => go("intention")} /><Text style={styles.step}>02 / PATH</Text></View>
        <View style={styles.flowContent}>
          <Text style={styles.flowTitle}>Choose the language of this reading.</Text>
          <Text style={styles.flowCopy}>Both paths are made for reflection, not prediction.</Text>
          <Pressable onPress={() => { setMethod("tarot"); haptic.select(); }} style={({ pressed }) => [styles.methodCard, method === "tarot" && styles.methodSelected, pressed && styles.pressed]}>
            <View style={[styles.methodIcon, { backgroundColor: "#C6A86A" }]}><MaterialIcons name="auto-awesome" size={23} color="#101321" /></View>
            <View style={styles.methodCopy}><Text style={styles.methodName}>Tarot</Text><Text style={styles.methodDescription}>One image. A direct reflection.</Text></View>
            <MaterialIcons name={method === "tarot" ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={method === "tarot" ? "#C6A86A" : "#858A99"} />
          </Pressable>
          <Pressable onPress={() => { setMethod("iching"); haptic.select(); }} style={({ pressed }) => [styles.methodCard, method === "iching" && styles.methodSelected, pressed && styles.pressed]}>
            <View style={[styles.methodIcon, { backgroundColor: "#7D9077" }]}><MaterialIcons name="spa" size={23} color="#101321" /></View>
            <View style={styles.methodCopy}><Text style={styles.methodName}>I Ching</Text><Text style={styles.methodDescription}>A living change. A direction of becoming.</Text></View>
            <MaterialIcons name={method === "iching" ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={method === "iching" ? "#7D9077" : "#858A99"} />
          </Pressable>
          <View style={styles.flowSpacer} />
          <PrimaryButton label="Continue" onPress={() => go("draw")} />
        </View>
      </ScreenContainer>
    );
  }

  if (stage === "draw") {
    const isTarot = method === "tarot";
    return (
      <ScreenContainer className="p-5" containerClassName="bg-[#101321]">
        <View style={styles.flowHeader}><BackButton onPress={() => go("method")} /><Text style={styles.step}>03 / DRAW</Text></View>
        <View style={styles.drawContent}>
          <Text style={styles.drawEyebrow}>{isTarot ? "ONE CARD" : "A CHANGING PATH"}</Text>
          <Text style={styles.flowTitle}>Let the question settle.</Text>
          <View style={[styles.drawCard, { borderColor: isTarot ? "#C6A86A" : "#7D9077" }]}>
            <View style={[styles.drawHalo, { backgroundColor: isTarot ? "#C6A86A" : "#7D9077" }]} />
            <MaterialIcons name={isTarot ? "auto-awesome" : "spa"} size={46} color="#F5F0E6" />
            <Text style={styles.drawCardTitle}>{isTarot ? "Hold the lantern" : "Listen for the turn"}</Text>
            <Text style={styles.drawCardCopy}>{isTarot ? "One image will meet you where you are." : "A current and its direction will come into view."}</Text>
          </View>
          <View style={styles.flowSpacer} />
          <PrimaryButton label={isTarot ? "Draw a card" : "Receive the change"} onPress={draw} icon="auto-awesome" />
        </View>
      </ScreenContainer>
    );
  }

  if (stage === "reading" && reading) {
    const accent = accentFor(reading.accent);
    return (
      <ScreenContainer className="p-5" containerClassName="bg-[#101321]">
        <View style={styles.flowHeader}><BackButton onPress={() => go("draw")} /><Text style={styles.step}>YOUR READING</Text></View>
        <ScrollView contentContainerStyle={styles.readingContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.symbolPanel, { borderColor: accent }]}>
            <View style={[styles.symbolDot, { backgroundColor: accent }]} />
            <Text style={styles.symbolMethod}>{reading.method === "tarot" ? "TAROT" : "I CHING"}</Text>
            <Text style={styles.symbolName}>{reading.symbol}</Text>
            <Text style={styles.symbolSubtitle}>{reading.subtitle}</Text>
          </View>
          <Text style={styles.readingKicker}>AN ADDRESS FOR THIS MOMENT</Text>
          <Text style={styles.readingTitle}>{reading.method === "tarot" ? "Stay with what is being shown." : "Let the change speak as one movement."}</Text>
          <Text style={styles.reflection}>{reading.reflection}</Text>
          {reading.discernment && <View style={styles.discernment}><MaterialIcons name="hourglass-bottom" size={20} color="#C6A86A" /><View style={styles.discernmentCopy}><Text style={styles.discernmentTitle}>Discernment</Text><Text style={styles.discernmentText}>For choices that cannot be easily undone, let clarity have time. Sit with what is stirred, seek wise human counsel, and attend to the consequences before calling this a yes or no.</Text></View></View>}
          <Pressable onPress={storeCurrentReading} style={({ pressed }) => [styles.saveButton, saved && styles.savedButton, pressed && styles.pressed]}><MaterialIcons name={saved ? "check" : "bookmark-border"} size={20} color="#101321" /><Text style={styles.saveButtonText}>{saved ? "Saved to journal" : "Save this reading"}</Text></Pressable>
          <PrimaryButton label="Begin again" onPress={beginAgain} icon="refresh" muted />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-5" containerClassName="bg-[#101321]">
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeTopline}><Text style={styles.brand}>NUMINOUS PATH</Text><View style={styles.privatePill}><MaterialIcons name="lock-outline" size={13} color="#C6A86A" /><Text style={styles.privatePillText}>PRIVATE</Text></View></View>
        <View style={styles.homeHero}><View style={styles.homeMark}><View style={styles.markGlow} /><MaterialIcons name="nightlight-round" size={42} color="#F5F0E6" /></View><Text style={styles.homeTitle}>Make room for what is asking to be heard.</Text><Text style={styles.homeSubtitle}>A quiet place for images, change, and a more honest next step.</Text></View>
        <View style={styles.homeNote}><MaterialIcons name="info-outline" size={19} color="#7D9077" /><Text style={styles.homeNoteText}>A reading offers reflection, not a verdict. Your life remains your own.</Text></View>
        <View style={styles.homeSpacer} />
        <PrimaryButton label="Begin a reading" onPress={() => go("intention")} icon="arrow-forward" />
        <Text style={styles.homeFooter}>TAROT · I CHING · LOCAL JOURNAL</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
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
  homeFooter: { color: "#73798A", fontSize: 10, fontWeight: "800", letterSpacing: 1.8, textAlign: "center", marginTop: 20 },
  primaryButton: { minHeight: 56, borderRadius: 18, backgroundColor: "#C6A86A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 20 },
  secondaryButton: { backgroundColor: "#22283A", borderWidth: 1, borderColor: "#333A4E", marginTop: 12 },
  primaryButtonText: { color: "#101321", fontSize: 16, fontWeight: "800" },
  secondaryButtonText: { color: "#F5F0E6" },
  flowHeader: { flexDirection: "row", alignItems: "center", gap: 13, minHeight: 41 },
  backButton: { height: 40, width: 40, borderRadius: 20, borderWidth: 1, borderColor: "#343A4F", alignItems: "center", justifyContent: "center" },
  step: { color: "#A3A8B6", fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  flowContent: { flexGrow: 1, paddingTop: 39, paddingBottom: 18 },
  flowTitle: { color: "#F5F0E6", fontSize: 31, lineHeight: 38, fontWeight: "700", letterSpacing: -0.8 },
  flowCopy: { color: "#AEB3C0", fontSize: 15, lineHeight: 23, marginTop: 13 },
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
  drawContent: { flex: 1, paddingTop: 32, paddingBottom: 18, alignItems: "center" },
  drawEyebrow: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.9, marginBottom: 12 },
  drawCard: { width: "100%", minHeight: 278, backgroundColor: "#171B2B", borderRadius: 28, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, marginTop: 30, overflow: "hidden" },
  drawHalo: { position: "absolute", width: 180, height: 180, borderRadius: 90, opacity: 0.1 },
  drawCardTitle: { color: "#F5F0E6", fontSize: 23, fontWeight: "800", marginTop: 20, textAlign: "center" },
  drawCardCopy: { color: "#B0B4C1", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 9, maxWidth: 230 },
  readingContent: { paddingTop: 24, paddingBottom: 26 },
  symbolPanel: { backgroundColor: "#171B2B", borderWidth: 1, borderRadius: 22, padding: 22, alignItems: "center" },
  symbolDot: { height: 12, width: 12, borderRadius: 6, marginBottom: 15 },
  symbolMethod: { color: "#959AAA", fontSize: 10, fontWeight: "800", letterSpacing: 1.7 },
  symbolName: { color: "#F5F0E6", fontSize: 27, fontWeight: "800", letterSpacing: -0.5, textAlign: "center", marginTop: 7 },
  symbolSubtitle: { color: "#B0B4C1", fontSize: 14, fontStyle: "italic", marginTop: 6 },
  readingKicker: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginTop: 32 },
  readingTitle: { color: "#F5F0E6", fontSize: 26, lineHeight: 33, fontWeight: "800", letterSpacing: -0.55, marginTop: 11 },
  reflection: { color: "#E1DDD3", fontSize: 17, lineHeight: 29, marginTop: 18 },
  discernment: { flexDirection: "row", gap: 12, backgroundColor: "#222738", borderLeftWidth: 3, borderLeftColor: "#C6A86A", borderRadius: 16, padding: 16, marginTop: 25 },
  discernmentCopy: { flex: 1 },
  discernmentTitle: { color: "#F5F0E6", fontSize: 14, fontWeight: "800", marginBottom: 4 },
  discernmentText: { color: "#C4C8D1", fontSize: 13, lineHeight: 20 },
  saveButton: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 17, backgroundColor: "#C6A86A", marginTop: 29 },
  savedButton: { backgroundColor: "#A9BBA5" },
  saveButtonText: { color: "#101321", fontSize: 16, fontWeight: "800" },
});
