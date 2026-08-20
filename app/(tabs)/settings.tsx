import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { clearReadings } from "@/lib/reading-store";

export default function SettingsScreen() {
  const [gentleMotion, setGentleMotion] = useState(true);
  const [cleared, setCleared] = useState(false);

  const confirmClear = () => {
    Alert.alert("Clear journal?", "This removes the readings saved on this device. This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear journal", style: "destructive", onPress: async () => { await clearReadings(); setCleared(true); haptic.medium(); } },
    ]);
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-[#101321]">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>A QUIET PLACE TO RETURN TO</Text>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.manifesto}><View style={styles.manifestoIcon}><MaterialIcons name="nightlight-round" size={27} color="#C6A86A" /></View><Text style={styles.manifestoTitle}>The approach</Text><Text style={styles.manifestoText}>Numinous Path makes room for attention, not certainty. Each reading is an invitation to notice what is present and to meet important choices with care.</Text></View>
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.row}><View style={styles.rowIcon}><MaterialIcons name="motion-photos-on" size={21} color="#7D9077" /></View><View style={styles.rowText}><Text style={styles.rowTitle}>Gentle motion</Text><Text style={styles.rowCopy}>Keep transitions calm and subtle.</Text></View><Switch value={gentleMotion} onValueChange={(value) => { setGentleMotion(value); haptic.select(); }} trackColor={{ false: "#41485A", true: "#7D9077" }} thumbColor="#F5F0E6" /></View>
        <Text style={styles.sectionLabel}>PRIVACY</Text>
        <View style={styles.privacy}><MaterialIcons name="phone-iphone" size={22} color="#C6A86A" /><View style={styles.privacyCopy}><Text style={styles.rowTitle}>Stored on this device</Text><Text style={styles.rowCopy}>Your intentions and saved readings are kept locally. No account is required.</Text></View></View>
        <Pressable onPress={confirmClear} style={({ pressed }) => [styles.clear, pressed && styles.pressed]}><MaterialIcons name="delete-outline" size={20} color="#E6AAA0" /><Text style={styles.clearText}>{cleared ? "Journal cleared" : "Clear local journal"}</Text></Pressable>
        <Text style={styles.version}>NUMINOUS PATH · VERSION 1.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 28, paddingBottom: 34 },
  eyebrow: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  title: { color: "#F5F0E6", fontSize: 34, fontWeight: "800", letterSpacing: -1, marginTop: 8 },
  manifesto: { backgroundColor: "#171B2B", borderRadius: 22, borderWidth: 1, borderColor: "#2D3346", padding: 19, marginTop: 25 },
  manifestoIcon: { height: 43, width: 43, borderRadius: 14, backgroundColor: "#252A3A", alignItems: "center", justifyContent: "center", marginBottom: 13 },
  manifestoTitle: { color: "#F5F0E6", fontSize: 17, fontWeight: "800" },
  manifestoText: { color: "#C0C4CE", fontSize: 14, lineHeight: 21, marginTop: 7 },
  sectionLabel: { color: "#868C9D", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginTop: 29, marginBottom: 10 },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", backgroundColor: "#171B2B", borderWidth: 1, borderColor: "#2D3346", borderRadius: 18, paddingHorizontal: 15, gap: 12 },
  rowIcon: { height: 39, width: 39, borderRadius: 13, backgroundColor: "#222838", alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  rowTitle: { color: "#F5F0E6", fontSize: 15, fontWeight: "800" },
  rowCopy: { color: "#AEB3C0", fontSize: 12, lineHeight: 18, marginTop: 3 },
  privacy: { flexDirection: "row", alignItems: "flex-start", gap: 13, backgroundColor: "#171B2B", borderWidth: 1, borderColor: "#2D3346", borderRadius: 18, padding: 16 },
  privacyCopy: { flex: 1 },
  clear: { minHeight: 51, flexDirection: "row", gap: 9, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#603B40", borderRadius: 16, marginTop: 13 },
  clearText: { color: "#E6AAA0", fontSize: 15, fontWeight: "800" },
  version: { color: "#6F7586", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, textAlign: "center", marginTop: 30 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
