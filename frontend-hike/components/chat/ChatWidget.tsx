import { useRef, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "bot", content: "Thinking..." }]);

    try {
      const backendUrl = "http://YOUR_IP:8000/api/chat";

      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const withoutTyping = prev.slice(0, -1);
        return [...withoutTyping, { role: "bot", content: data.reply }];
      });
    } catch (err) {
      setMessages((prev) => {
        const withoutTyping = prev.slice(0, -1);
        return [
          ...withoutTyping,
          {
            role: "bot",
            content: "Server unreachable.",
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Pressable style={styles.floatingBtn} onPress={() => setVisible(true)}>
        <Text style={styles.icon}>💬</Text>
      </Pressable>

      {/* Chat Modal */}
      <Modal visible={visible} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Hike Assistant</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <ChatBubble role={item.role} content={item.content} />
            )}
            contentContainerStyle={styles.messages}
            onContentSizeChange={() => listRef.current?.scrollToEnd()}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingBtn: {
    position: "absolute",
    bottom: 140,
    right: 20,
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 30,
    zIndex: 999,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    color: "#ffffff",
    fontSize: 22,
  },
  modal: {
    flex: 1,
    backgroundColor: "#0f172a", // dark bg
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#1f2933",
    backgroundColor: "#020617",
  },
  headerText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeText: {
    color: "#16a34a",
    fontWeight: "600",
  },
  messages: {
    padding: 12,
  },
});
