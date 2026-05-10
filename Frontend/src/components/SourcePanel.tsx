import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Plus, ListFilter, Trash2 } from "lucide-react-native";
import { THEME } from "../constants/theme";
import { SourceCard } from "./SourceCard";

interface Source {
  id: string;
  name: string;
  type: "pdf" | "url" | "text";
  date: string;
  isSelected: boolean;
}

interface SourcePanelProps {
  sources: Source[];
  onAdd: () => void;
  onToggle: (id: string) => void;
  onToggleAll: (select: boolean) => void;
}

export const SourcePanel = ({ sources, onAdd, onToggle, onToggleAll }: SourcePanelProps) => {
  const selectedCount = sources.filter(s => s.isSelected).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sources</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Plus size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity 
          onPress={() => onToggleAll(selectedCount !== sources.length)}
          style={styles.filterAction}
        >
          <Text style={styles.filterText}>
            {selectedCount === sources.length ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.countText}>{selectedCount} of {sources.length}</Text>
      </View>
      
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {sources.map(source => (
          <SourceCard
            key={source.id}
            name={source.name}
            type={source.type}
            date={source.date}
            isSelected={source.isSelected}
            onToggle={() => onToggle(source.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {sources.length} sources • 12.4k tokens
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: THEME.spacing.md,
    paddingTop: 20,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontFamily: THEME.fonts.heading,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: THEME.fonts.bodyMedium,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  filterAction: {
    paddingVertical: 4,
  },
  filterText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontFamily: THEME.fonts.bodyMedium,
    textTransform: "uppercase",
  },
  countText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontFamily: THEME.fonts.mono,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: THEME.spacing.md,
  },
  footer: {
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  footerText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontFamily: THEME.fonts.body,
    textAlign: "center",
  },
});
