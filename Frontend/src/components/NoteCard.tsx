import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Trash2, ExternalLink } from "lucide-react-native";
import { THEME } from "../constants/theme";

interface NoteCardProps {
  id: string;
  content: string;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}

export const NoteCard = ({ content, onUpdate, onDelete }: NoteCardProps) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.timestamp}>Saved 2m ago</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}>
          <ExternalLink size={14} color={THEME.colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onDelete}>
          <Trash2 size={14} color={THEME.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
    
    <TextInput
      style={styles.input}
      value={content}
      onChangeText={onUpdate}
      multiline
      placeholder="Type a note..."
      placeholderTextColor={THEME.colors.textMuted}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.sm,
  },
  timestamp: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontFamily: THEME.fonts.mono,
    textTransform: "uppercase",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  input: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontFamily: THEME.fonts.body,
    lineHeight: 20,
    textAlignVertical: "top",
  },
});
