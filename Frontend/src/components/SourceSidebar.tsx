import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FileText, Plus, BookOpen } from "lucide-react-native";

interface SourceSidebarProps {
  fileName?: string;
  onAddSource: () => void;
}

export const SourceSidebar = ({ fileName, onAddSource }: SourceSidebarProps) => (
  <View style={styles.sidebar}>
    <View style={styles.sectionHeader}>
      <BookOpen size={18} color="#38bdf8" />
      <Text style={styles.sectionTitle}>Sources</Text>
    </View>

    <ScrollView style={styles.sourceList}>
      <View style={styles.sourceItem}>
        <FileText size={20} color="#94a3b8" />
        <View style={styles.sourceInfo}>
          <Text style={styles.sourceName} numberOfLines={1}>
            {fileName}
          </Text>
          <Text style={styles.sourceStatus}>Indexed</Text>
        </View>
      </View>
    </ScrollView>

    <TouchableOpacity style={styles.addSourceBtn} onPress={onAddSource}>
      <Plus size={18} color="#fff" />
      <Text style={styles.addSourceText}>Add Source</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "700",
  },
  sourceList: {
    flex: 1,
  },
  sourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "500",
  },
  sourceStatus: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 2,
  },
  addSourceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#38bdf8",
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  addSourceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
