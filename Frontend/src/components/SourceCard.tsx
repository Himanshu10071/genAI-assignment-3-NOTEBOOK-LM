import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FileText, Link, Type, Trash2, Eye } from "lucide-react-native";
import { THEME } from "../constants/theme";

interface SourceCardProps {
  type: "pdf" | "url" | "text";
  name: string;
  date: string;
  isSelected: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}

export const SourceCard = ({ 
  type, 
  name, 
  date, 
  isSelected, 
  onToggle, 
  onDelete, 
  onPreview 
}: SourceCardProps) => {
  const Icon = type === "pdf" ? FileText : type === "url" ? Link : Type;

  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrapper, isSelected && styles.selectedIconWrapper]}>
          <Icon size={18} color={isSelected ? THEME.colors.accent : THEME.colors.textSecondary} />
        </View>
        
        <View style={styles.textWrapper}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
          {isSelected && <View style={styles.checkMark} />}
        </View>
      </View>

      {/* Hover actions would go here in a web-focused implementation, 
          for RN we'll keep it simple or use a menu */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  selectedContainer: {
    borderColor: THEME.colors.accent,
    backgroundColor: "rgba(108, 99, 255, 0.05)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: THEME.spacing.md,
  },
  selectedIconWrapper: {
    backgroundColor: "rgba(108, 99, 255, 0.1)",
  },
  textWrapper: {
    flex: 1,
  },
  name: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontFamily: THEME.fonts.bodyMedium,
  },
  date: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontFamily: THEME.fonts.body,
    marginTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  checkMark: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
});
