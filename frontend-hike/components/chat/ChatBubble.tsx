// frontend-hike/components/chat/ChatBubble.tsx
// Markdown support add kiya — bot ke bold, bullets, headings properly dikhenge

import { View, StyleSheet, Text } from "react-native";
import Markdown from "react-native-markdown-display";

type Props = {
  role: "user" | "bot";
  content: string;
};

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
      {isUser ? (
        <Text style={styles.userText}>{content}</Text>
      ) : (
        <Markdown style={markdownStyles}>{content}</Markdown>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 6,
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#16a34a",
    borderTopRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 4,
  },
  userText: {
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 20,
  },
});

const markdownStyles = {
  body: { color: "#e2e8f0", fontSize: 14, lineHeight: 20 },
  strong: { color: "#ffffff", fontWeight: "bold" as const },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { color: "#e2e8f0", fontSize: 14, lineHeight: 22 },
  bullet_list_icon: { color: "#22c55e", fontSize: 14 },
  heading1: { color: "#ffffff", fontSize: 16, fontWeight: "bold" as const, marginBottom: 6 },
  heading2: { color: "#ffffff", fontSize: 15, fontWeight: "bold" as const, marginBottom: 4 },
  code_inline: { backgroundColor: "#0f172a", color: "#22c55e", fontSize: 13, borderRadius: 4 },
  fence: { backgroundColor: "#0f172a", borderRadius: 8, padding: 10, color: "#22c55e", fontSize: 13 },
  blockquote: { backgroundColor: "#0f172a", borderLeftColor: "#22c55e", borderLeftWidth: 3, paddingLeft: 10 },
  hr: { backgroundColor: "#334155", height: 1, marginVertical: 8 },
  link: { color: "#22c55e" },
  paragraph: { marginTop: 2, marginBottom: 2 },
};
