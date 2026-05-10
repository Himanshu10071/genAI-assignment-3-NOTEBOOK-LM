import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { THEME } from "../constants/theme";
import { Copy, X } from "lucide-react-native";
import Markdown from "react-native-markdown-display";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  sources?: any[];
  timestamp?: string;
}

const markdownStyles = StyleSheet.create({
  body: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  strong: {
    fontWeight: "800",
    color: THEME.colors.accent,
  },
  table: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 8,
    marginVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: "row",
  },
  th: {
    padding: 10,
    backgroundColor: THEME.colors.surfacePaper,
    fontWeight: "900",
    color: THEME.colors.textSecondary,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  td: {
    padding: 10,
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  bullet_list: {
    marginVertical: 12,
  },
  list_item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet_list_icon: {
    color: THEME.colors.accent,
    fontSize: 18,
    marginRight: 10,
    lineHeight: 22,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
  },
});

export const MessageBubble = ({ msg }: { msg: Message }) => {
  const isBot = msg.sender === "bot";
  const [activeSource, setActiveSource] = React.useState<number | null>(null);

  return (
    <View style={[styles.container, isBot ? styles.botContainer : styles.userContainer]}>
      <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
        {isBot ? (
          <Markdown style={markdownStyles}>
            {msg.text}
          </Markdown>
        ) : (
          <Text style={styles.userText}>{msg.text}</Text>
        )}
        
        {isBot && msg.sources && msg.sources.length > 0 && (
          <View style={styles.sourceContainer}>
            <View style={styles.sourceHeader}>
              <Text style={styles.sourceTitle}>SOURCES</Text>
              <TouchableOpacity style={styles.copyBtn}>
                <Copy size={14} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.sourceGrid}>
              {msg.sources.map((source, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.sourceMiniCard,
                    activeSource === index && styles.sourceCardActive
                  ]}
                  onPress={() => setActiveSource(activeSource === index ? null : index)}
                >
                  <View style={styles.sourceIndex}>
                    <Text style={styles.sourceIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.sourceName} numberOfLines={1}>
                    {source.metadata?.filename || `Source ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeSource !== null && (
              <View style={styles.inspectionCard}>
                <View style={styles.inspectionHeader}>
                  <Text style={styles.inspectionTitle}>GROUNDING TEXT</Text>
                  <TouchableOpacity onPress={() => setActiveSource(null)}>
                    <X size={14} color={THEME.colors.accent} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.inspectionText}>
                  "{msg.sources[activeSource].text || msg.sources[activeSource].pageContent}"
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      {!isBot && msg.timestamp && (
        <Text style={styles.timestamp}>{msg.timestamp}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.lg,
    maxWidth: "85%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  botContainer: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    width: "100%",
  },
  bubble: {
    padding: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  userBubble: {
    backgroundColor: THEME.colors.surfacePaper,
    borderBottomRightRadius: 4,
    borderRightWidth: 4,
    borderRightColor: THEME.colors.accent,
  },
  botBubble: {
    backgroundColor: THEME.colors.surfaceSecondary,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: THEME.colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 22,
  },
  sourceContainer: {
    marginTop: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  sourceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.md,
  },
  sourceTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.colors.textMuted,
    letterSpacing: 1,
  },
  sourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sourceMiniCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: THEME.colors.surface,
    padding: 8,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minWidth: 110,
  },
  sourceCardActive: {
    borderColor: THEME.colors.accent,
    backgroundColor: THEME.colors.accentLight,
  },
  inspectionCard: {
    marginTop: THEME.spacing.lg,
    padding: 16,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    borderStyle: "dashed",
  },
  inspectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  inspectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: THEME.colors.accent,
    letterSpacing: 1.5,
  },
  inspectionText: {
    fontSize: 13,
    lineHeight: 20,
    color: THEME.colors.textPrimary,
    fontStyle: "italic",
  },
  sourceIndex: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: THEME.colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME.colors.accent,
  },
  sourceIndexText: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.colors.accent,
  },
  sourceName: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    fontWeight: "700",
  },
  copyBtn: {
    padding: 4,
  },
  timestamp: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    textAlign: "right",
    marginTop: 4,
  },
});
