import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

const canHaptic = Platform.OS !== "web";

export const haptic = {
  light: () => {
    if (canHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  medium: () => {
    if (canHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  select: () => {
    if (canHaptic) Haptics.selectionAsync();
  },
  success: () => {
    if (canHaptic) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
};
