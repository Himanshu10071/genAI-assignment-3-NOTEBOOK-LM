import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { THEME } from "../constants/theme";

interface CitationChipProps {
  number: number;
  onPress?: () => void;
}

export const CitationChip = ({ number, onPress }: CitationChipProps) => (
  <TouchableOpacity 
    style={styles.container} 
    onPress={onPress}
    activeOpacity={0.6}
  >
    <Text style={styles.text}>{number}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.accentLight,
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME.colors.accent,
  },
  text: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: "800",
  },
});
