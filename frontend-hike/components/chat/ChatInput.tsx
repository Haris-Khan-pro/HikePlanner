import React from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

type Props = {
  input: string;
  setInput: (text: string) => void;
  onSend: () => void;
  loading: boolean;
};

export default function ChatInput({
  input,
  setInput,
  onSend,
  loading,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask about trails..."
        placeholderTextColor="#9ca3af"
        value={input}
        onChangeText={setInput}
      />
      <Pressable
        onPress={onSend}
        disabled={loading}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {loading ? "..." : "Send"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#111827",
    borderTopWidth: 1,
    borderColor: "#1f2933",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1f2933",
    borderRadius: 10,
    color: "#e5e7eb",
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

