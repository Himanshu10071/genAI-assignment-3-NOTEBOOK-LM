import React, { useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { Send, Share2, Download, CornerDownRight } from "lucide-react-native";
import { THEME } from "../constants/theme";
import { MessageBubble } from "./MessageBubble";
import { ThinkingBubble } from "./ThinkingBubble";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  sources?: any[];
}

interface ChatPanelProps {
  notebookTitle: string;
  messages: Message[];
  question: string;
  setQuestion: (q: string) => void;
  onAsk: () => void;
  isThinking: boolean;
  suggestions: string[];
}

export const ChatPanel = ({
  notebookTitle,
  messages,
  question,
  setQuestion,
  onAsk,
  isThinking,
  suggestions,
}: ChatPanelProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.titleInput} 
          value={notebookTitle}
          placeholder="Untitled Notebook"
          placeholderTextColor={THEME.colors.textMuted}
        />
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 size={18} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Download size={18} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isThinking && <ThinkingBubble />}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.inputArea}
      >
        <View style={styles.suggestions}>
          {suggestions.map((s, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.suggestionPill}
              onPress={() => setQuestion(s)}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about your sources..."
            placeholderTextColor={THEME.colors.textMuted}
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !question.trim() && styles.sendBtnDisabled]}
            onPress={onAsk}
            disabled={!question.trim() || isThinking}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputFooter}>
          <CornerDownRight size={10} color={THEME.colors.textMuted} />
          <Text style={styles.footerText}>Press Enter to ask</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  titleInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontFamily: THEME.fonts.bodyBold,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    padding: 8,
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    padding: THEME.spacing.xl,
    paddingTop: THEME.spacing.lg,
  },
  inputArea: {
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  suggestionPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  suggestionText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontFamily: THEME.fonts.bodyMedium,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  input: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontFamily: THEME.fonts.body,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: THEME.colors.border,
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 8,
  },
  footerText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontFamily: THEME.fonts.mono,
    textTransform: "uppercase",
  },
});
