import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet 
} from "react-native";
import { Send, Image as ImageIcon, Mic } from "lucide-react-native";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  sources?: any[];
}

interface ChatInterfaceProps {
  fileName?: string;
  messages: Message[];
  question: string;
  setQuestion: (q: string) => void;
  onAsk: () => void;
  isThinking: boolean;
  scrollViewRef: React.RefObject<ScrollView>;
}

export const ChatInterface = ({
  messages,
  question,
  setQuestion,
  onAsk,
  isThinking,
  scrollViewRef,
}: ChatInterfaceProps) => (
  <View style={styles.container}>
    <ScrollView 
      ref={scrollViewRef}
      contentContainerStyle={styles.messagesList}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      {messages.length === 0 ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to your new notebook</Text>
          <Text style={styles.welcomeSubtitle}>
            I've read your sources and I'm ready to help you analyze, summarize, and explore their content.
          </Text>
          <View style={styles.suggestionGrid}>
            <TouchableOpacity style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>Summarize this document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>What are the key findings?</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))
      )}
      {isThinking && (
        <View style={styles.thinkingContainer}>
          <ActivityIndicator size="small" color="#1a73e8" />
          <Text style={styles.thinkingText}>EchoBot is processing...</Text>
        </View>
      )}
    </ScrollView>

    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={styles.inputArea}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question..."
          placeholderTextColor="#5f6368"
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <View style={styles.inputActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <ImageIcon size={20} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Mic size={20} color="#5f6368" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendBtn, !question.trim() && styles.sendBtnDisabled]} 
            onPress={onAsk}
            disabled={!question.trim() || isThinking}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  messagesList: {
    paddingBottom: 40,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "400",
    color: "#202124",
    textAlign: "center",
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#5f6368",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 500,
  },
  suggestionGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dadce0",
    backgroundColor: "#ffffff",
  },
  suggestionText: {
    fontSize: 14,
    color: "#3c4043",
    fontWeight: "500",
  },
  thinkingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  thinkingText: {
    color: "#5f6368",
    fontSize: 14,
    fontStyle: "italic",
  },
  inputArea: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: "#ffffff",
  },
  inputContainer: {
    backgroundColor: "#f1f3f4",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    fontSize: 16,
    color: "#202124",
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a73e8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  sendBtnDisabled: {
    backgroundColor: "#dadce0",
  },
});
