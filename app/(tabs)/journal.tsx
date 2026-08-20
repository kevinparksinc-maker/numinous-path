import { useCallback, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenContainer } from "@/components/screen-container";
import type { Reading } from "@/lib/reading-engine";
import { getReadings } from "@/lib/reading-store";

const formatDate = (iso: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

export default function JournalScreen() {
  const [entries, setEntries] = useState<Reading[]>([]);
  const [selected, setSelected] = useState<Reading | null>(null);

  const refresh = useCallback(() => {
    getReadings().then(setEntries);
  }, []);

  useFocusEffect(refresh);

  return (
    <ScreenContainer className="px-5" containerClassName="bg-[#101321]">
      <View style={styles.header}><Text style={styles.eyebrow}>YOUR PRIVATE ARCHIVE</Text><Text style={styles.title}>Journal</Text><Text style={styles.subtitle}>Readings you choose to keep remain on this device.</Text></View>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={entries.length ? styles.list : styles.emptyList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Pressable onPress={() => setSelected(item)} style={({ pressed }) => [styles.entry, pressed && styles.pressed]}><View style={[styles.entryAccent, { backgroundColor: item.accent === "moss" ? "#7D9077" : item.accent === "clay" ? "#C98072" : "#C6A86A" }]} /><View style={styles.entryCopy}><Text style={styles.entryMeta}>{item.method === "tarot" ? "TAROT" : "I CHING"} · {formatDate(item.createdAt)}</Text><Text style={styles.entryTitle}>{item.symbol}</Text><Text numberOfLines={2} style={styles.entryExcerpt}>{item.intention || "A quiet reading"}</Text></View><MaterialIcons name="chevron-right" color="#828899" size={23} /></Pressable>}
        ListEmptyComponent={<View style={styles.empty}><View style={styles.emptyIcon}><MaterialIcons name="menu-book" size={30} color="#C6A86A" /></View><Text style={styles.emptyTitle}>Nothing held here yet.</Text><Text style={styles.emptyCopy}>Save a reading when you want to return to it. Your journal stays on this device.</Text></View>}
      />
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}><View style={styles.modal}><Pressable accessibilityLabel="Close reading" onPress={() => setSelected(null)} style={styles.close}><MaterialIcons name="close" size={21} color="#F5F0E6" /></Pressable>{selected && <ScrollView showsVerticalScrollIndicator={false}><Text style={styles.modalMeta}>{selected.method === "tarot" ? "TAROT" : "I CHING"} · {formatDate(selected.createdAt)}</Text><Text style={styles.modalSymbol}>{selected.symbol}</Text><Text style={styles.modalSubtitle}>{selected.subtitle}</Text>{selected.intention ? <View style={styles.intention}><Text style={styles.intentionLabel}>YOU BROUGHT</Text><Text style={styles.intentionText}>{selected.intention}</Text></View> : null}<Text style={styles.modalReflection}>{selected.reflection}</Text>{selected.discernment ? <View style={styles.discernment}><Text style={styles.discernmentTitle}>Discernment</Text><Text style={styles.discernmentCopy}>For choices that cannot be easily undone, allow clarity to take its time and include trustworthy human counsel.</Text></View> : null}</ScrollView>}</View></View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 26, paddingBottom: 24 },
  eyebrow: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.7 },
  title: { color: "#F5F0E6", fontSize: 34, fontWeight: "800", letterSpacing: -1, marginTop: 8 },
  subtitle: { color: "#AEB3C0", fontSize: 14, lineHeight: 21, marginTop: 7, maxWidth: 275 },
  list: { paddingBottom: 28, gap: 11 },
  emptyList: { flexGrow: 1, justifyContent: "center", paddingBottom: 90 },
  entry: { backgroundColor: "#171B2B", borderRadius: 19, minHeight: 106, flexDirection: "row", alignItems: "center", padding: 15, gap: 13, borderWidth: 1, borderColor: "#292E41" },
  entryAccent: { width: 5, alignSelf: "stretch", borderRadius: 4 },
  entryCopy: { flex: 1 },
  entryMeta: { color: "#9298A8", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  entryTitle: { color: "#F5F0E6", fontSize: 17, fontWeight: "800", marginTop: 5 },
  entryExcerpt: { color: "#B3B8C4", fontSize: 13, lineHeight: 18, marginTop: 4 },
  empty: { alignItems: "center", paddingHorizontal: 36 },
  emptyIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#1B2131", borderWidth: 1, borderColor: "#333A4C", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { color: "#F5F0E6", fontSize: 22, fontWeight: "800" },
  emptyCopy: { color: "#ABB0BD", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  modalOverlay: { flex: 1, backgroundColor: "rgba(5,7,14,0.74)", justifyContent: "flex-end" },
  modal: { maxHeight: "86%", backgroundColor: "#171B2B", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 36 },
  close: { position: "absolute", right: 18, top: 16, height: 38, width: 38, borderRadius: 19, backgroundColor: "#2A3042", alignItems: "center", justifyContent: "center", zIndex: 2 },
  modalMeta: { color: "#C6A86A", fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  modalSymbol: { color: "#F5F0E6", fontSize: 30, fontWeight: "800", letterSpacing: -0.7, marginTop: 9 },
  modalSubtitle: { color: "#ABB0BE", fontSize: 15, fontStyle: "italic", marginTop: 5 },
  intention: { marginTop: 25, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#31384A" },
  intentionLabel: { color: "#9298A8", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  intentionText: { color: "#D6D1C7", fontSize: 14, lineHeight: 20, marginTop: 6 },
  modalReflection: { color: "#E2DED4", fontSize: 17, lineHeight: 29, marginTop: 25 },
  discernment: { marginTop: 24, padding: 15, backgroundColor: "#222738", borderLeftWidth: 3, borderLeftColor: "#C6A86A", borderRadius: 14 },
  discernmentTitle: { color: "#F5F0E6", fontSize: 14, fontWeight: "800" },
  discernmentCopy: { color: "#C2C6D0", fontSize: 13, lineHeight: 19, marginTop: 5 },
});
