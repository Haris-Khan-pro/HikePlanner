import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  role: "user" | "bot";
  content: string;
};

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={[styles.text, isUser && styles.userText]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 6,
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#16a34a", // green
    borderTopRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1f2933", // dark gray
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    color: "#e5e7eb",
  },
  userText: {
    color: "#ffffff",
  },
});

